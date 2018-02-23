import initialState from './initialState';
import * as types from '../actions/actionTypes';
import {
  deepCloneNode,
  deepReplaceNodes
} from '../utils/astUtils';
import esCodeGen from "escodegen";
import esTraverse from "estraverse";
import {
  namedTypes as n,
  builders as b
} from "../lib/ast-types";

/**
 * Returns a new results object with all changes applied
 */
export default function resultsReducer(immutableState = initialState, action) {
  const immutableResults = immutableState.results;

  switch(action.type) {
    case types.INPUT_CONFIRM:
      try {
        return runAST(immutableState.ast);
      } catch (exception) {
        return immutableResults;
      }
    default:
      return immutableResults;
  }
}

/**
 * Executes an AST and returns the results object
 */
const runAST = (immutableAST) => {
  // We have to modify the AST, so we make a deep copy of it
  let mutableAST = deepCloneNode(immutableAST);

  // Remove all non-standard parts of the AST
  removeComments(mutableAST);

  // Check if the AST is now valid
  const isASTValid = n.Program.check(mutableAST, true);
  if(!isASTValid) {
    console.warn("AST is not valid");
    throw Error("AST is not valid");
  }

  // Add tracking code for Identifiers
  addIdentifierTracker(mutableAST);

  // Prepare the run environment TODO: Clean up
  window.runResults = {};
  const prependCode = `const __var_logger = (key, value) => {
    window.runResults[key] = [typeof(value), value];
    return value
  }`;
  const code = `${prependCode}\n${esCodeGen.generate(mutableAST)}`;
  console.log(code);

  /* eslint-disable no-eval */
  eval(code);
  /* eslint-enable no-eval */

  return window.runResults;
}

/**
 * Removes all non-standard parts of the AST
 */
const removeComments = (mutableAST) =>
  deepReplaceNodes(mutableAST, (node) => {
    if(node.type === "Comment" || node.type === "Missing") {
      this.remove();
    }
  })

/**
 * Modifies an AST so that values and types of Identifiers are tracked
 */
const addIdentifierTracker = (mutableAST) => {
  /*
   * We have to distinguish between Identifiers that get assigned and those
   * that don't. We first catch all that get assigned by catching their parents,
   * then we catch the remaining ones directly
   */

  // Track Identifiers that get assigned
  esTraverse.replace(mutableAST, {
    leave: (node) => {
      if(node.type === "VariableDeclaration") {
        const id = node.declarations[0].id;
        id._tracked = true;
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
          let id = node.expression.left;
          id._tracked = true;
          return b.blockStatement([
            node,
            b.expressionStatement(
              b.callExpression(
                b.identifier("__var_logger"),
                [
                  b.literal(id._key),
                  b.identifier(id.name)
                ]
              )
            )
          ]);
        }
      } else if(node.type === "MemberExpression") {
        if(node.object.type === "Identifier") {
          node.object._tracked = true;
        }
        if(node.property.type === "Identifier") {
          node.property._tracked = true;
        }
      } else if(node.type === "UpdateExpression") {
        node.argument._tracked = true;
      }
      return node;
    }
  });

  // Track Identifiers that don't get assigned
  esTraverse.replace(mutableAST, {
    leave: (node) => {
      if(node.type === "Identifier") {
        // Ignore all Identifier that are already tracked or don't have a key
        if(!node._key || node._tracked) {
          return node;
        }
        // Replace the identifier with a tracking call
        return b.callExpression(
          b.identifier("__var_logger"),
          [
            b.literal(node._key),
            b.identifier(node.name)
          ]
        );
      }
    }
  })
}
