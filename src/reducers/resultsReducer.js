import initialState from './initialState';
import * as types from '../actions/actionTypes';
import { deepClone } from '../utils/astUtils';
import esCodeGen from "escodegen";
import esTraverse from "estraverse";
import {
  namedTypes as n,
  builders as b
} from "../lib/ast-types";

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
 * Executes an AST and returns the results
 */
const runAST = (immutableAST) => {
  // We have to modify the AST, so we make a deep copy of it
  let mutableAST = deepClone(immutableAST);

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
  const prependCode = "const __var_logger = (key, value) => window.runResults[key] = [typeof(value), value];";
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
const removeComments = (mutableAST) => {
  esTraverse.replace(mutableAST, {
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

/**
 * Modifies an AST so that values and types of Identifiers are tracked
 */
const addIdentifierTracker = (mutableAST) => {
  esTraverse.replace(mutableAST, {
    leave: (node) => {
      if(node.type === "VariableDeclaration") {
        const id = node.declarations[0].id;
        node.declarations.push(
          b.variableDeclarator(
            b.identifier("__var_placeholder_" + id.name),
            b.callExpression(
              b.identifier("__var_logger"),
              [
                b.literal(id._path),
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
                  b.literal(node.expression.left._path),
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