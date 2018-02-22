/* eslint-disable no-eval */
import initialState from './initialState';
import input from './inputReducer';
import ast from './astReducer';
import * as types from '../actions/actionTypes';
import {
  findElementWithKey,
  findParentOfElementWithKey,
  parentKey,
  propertyOfKey,
  indexOfKey,
  joinKeys,
} from '../utils/astUtils';
import * as elements from '../utils/astElements';
import dotProp from "dot-prop";
import esCodeGen from "escodegen";
import esTraverse from "estraverse";
import {
  namedTypes as n,
  builders as b
} from "../lib/ast-types";

export default function root(state = initialState, action) {
  // Call specialized reducers
  let newState = {
    ...state,
    ast: ast(state.ast, action),
    input: input(state.input, action),
  };

  // Root actions that require the entire state
  switch (action.type) {
    case types.INPUT_NEXT:
    case types.INPUT_CONFIRM:
      let [position, inserting] = inputNext(newState);
      newState = {
        ...newState,
        input: {
          ...newState.input,
          position: position,
          inserting: inserting,
          inline: !inserting // TODO: This does not work for inline inserting
        }
      };

      // TODO: Move this somewhere else
      let astCopy = deepClone(newState.ast);
      removeComments(astCopy);

      const astValid = n.Program.check(astCopy, true);
      if(astValid) {
        newState = {
          ...newState,
          results: runAST(astCopy)
        }
      } else {
        console.warn("AST was invalid");
      }

      return newState;
    default:
      return newState;
  }
}

const inputNext = (state) => {
  let position = state.input.position;
  let inserting = state.input.inserting;
  let currentElement = dotProp.get(state.ast, position);

  // Check if we were in a list
  if(inserting) {
    // Check if we have a next element on this level
    if(currentElement) {
      // Move to first property of the next element
      let tmpPosition, tmpInserting;
      [tmpPosition, tmpInserting] = getFirstEditableChildElementOf(currentElement);
      if(tmpPosition === position) {
        [position, inserting] = getNextEditableParentElementOf(currentElement, state.ast);
      } else {
        [position, inserting] = [tmpPosition, tmpInserting];
      }
    } else {
      // Move to next element on upper level
      currentElement = findElementWithKey(state.ast, parentKey(parentKey(position)));
      [position, inserting] = getNextEditableParentElementOf(currentElement, state.ast);
    }
  } else {
    // Try to move into the current element
    let tmpPosition;
    [tmpPosition, inserting] = getFirstEditableChildElementOf(findElementWithKey(state.ast, position));
    if(tmpPosition !== position) {
      return [tmpPosition, inserting];
    }

    [position, inserting] = getNextEditableParentElementOf(currentElement, state.ast);

    if(!inserting) {
      [position, inserting] = getFirstEditableChildElementOf(findElementWithKey(state.ast, position));
    }
  }

  return [position, inserting];
}

const getFirstEditableChildElementOf = (element) => {
  if(element.type in elements && elements[element.type].editableFields.length > 0) {
    const property = elements[element.type].editableFields[0];
    const nextElement = dotProp.get(element, property);
    if(nextElement instanceof Array) {
      return [joinKeys(element._key, `${property}.0`), true];
    }
    return getFirstEditableChildElementOf(nextElement);
  }
  return [element._key, false];
}

const getNextEditableParentElementOf = (element, ast) => {
  let searchProperty = propertyOfKey(element._key);
  const keyOfParent = parentKey(element._key);
  let parentElement = findElementWithKey(ast, keyOfParent);

  if(parentElement instanceof Array) {
    //TODO: Remove exception for VariableDeclaration
    if(findParentOfElementWithKey(ast, keyOfParent) &&
      findParentOfElementWithKey(ast, keyOfParent).type === "VariableDeclaration") {
      parentElement = findParentOfElementWithKey(ast, keyOfParent);
      searchProperty = "declarations.0.init";
    } else {
      const currentIndex = indexOfKey(element._key);
      const newPosition = joinKeys(keyOfParent, currentIndex+1);
      return [newPosition, true];
    }
  }

  const parentProperties = elements[parentElement.type].editableFields;
  const targetIndex = parentProperties.indexOf(searchProperty) + 1;

  if(targetIndex >= parentProperties.length) {
    return getNextEditableParentElementOf(parentElement, ast);
  } else {
    const newKey = joinKeys(parentElement._key, parentProperties[targetIndex]);
    if(findElementWithKey(ast, newKey) instanceof Array) {
      return [joinKeys(newKey, 0), true];
    }
    return [newKey, false];
  }
}

const deepClone = (node) => {
  return JSON.parse(JSON.stringify(node));
}

const removeComments = (ast) => {
  esTraverse.replace(ast, {
    enter: function (node) {
      if(node.type === "Comment") {
        this.remove();
      }
    },
    // Extending the existing traversing rules.
    keys: {
        Comment: ["text"],
        Missing: [],
    }
  });
}

const runAST = (ast) => {
  addIdentifierTracker(ast);
  window.runResults = {};
  const prependCode = "const __var_logger = (key, value) => window.runResults[key] = [typeof(value), value];";
  const code = `${prependCode}\n${esCodeGen.generate(ast)}`;
  console.log(code);
  eval(code);
  return window.runResults;
}

const addIdentifierTracker = (ast) => {
  // Track assignments
  esTraverse.replace(ast, {
    leave: (node) => {
      if(node.type === "VariableDeclaration") {
        const id = node.declarations[0].id;
        node.declarations.push(
          b.variableDeclarator(
            b.identifier("__var_placeholder_" + id.name),
            b.callExpression(
              b.identifier("__var_logger"),
              [
                b.literal(id._key),
                b.identifier(id.name)
              ]
            )
          )
        )
        return node;
      } else if(node.type === "ExpressionStatement") {
        if(node.expression.type === "AssignmentExpression") {
          return b.blockStatement([
            node,
            b.expressionStatement(
              b.callExpression(
                b.identifier("__var_logger"),
                [
                  b.literal(node.expression.left._key),
                  b.identifier(node.expression.left.name)
                ]
              )
            )
          ]);
        }
      }

      return node;
    }
  });
}
