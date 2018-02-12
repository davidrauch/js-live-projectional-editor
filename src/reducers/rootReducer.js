import initialState from './initialState';
import input from './inputReducer';
import ast from './astReducer';
import * as types from '../actions/actionTypes';
import {
  findElementWithKey,
  findParentOfElementWithKey,
  parentKey,
  propertyOfKey,
} from '../utils/astUtils';
import dotProp from "dot-prop";

export default function root(state = initialState, action) {
  // Call specialized reducers
  let newState = {
    ...state,
    ast: ast(state.ast, action),
    input: input(state.input, action),
  };

  // Root actions that require the entire state
  switch (action.type) {
    case types.INPUT_CONFIRM:
    let [position, inserting] = inputNext(newState);
      return {
        ...newState,
        input: {
          ...newState.input,
          position: position,
          inserting: inserting,
        }
      };
    default:
      return newState;
  }
}

const inputNext = (state) => {
  let position = state.input.position;
  let inserting = state.input.inserting;
  const currentElement = dotProp.get(state.ast, position);

  // Check if we were in a list
  if(inserting) {
    // Move to first property of the next element
    const newElement = getFirstEditableElementOf(currentElement);

    position = newElement._key;
    inserting = false;
  } else {
    // Go over the parent
    const keyOfParent = parentKey(position);
    const parentElement = findElementWithKey(state.ast, keyOfParent);

    const parentProperties = elementPropertyOrder[parentElement.type];
    const targetIndex = parentProperties.indexOf(propertyOfKey(position)) + 1;

    if(targetIndex >= parentProperties.length) {
      console.error("Should go farther up");
      return [position, inserting];
    }

    let newElement = dotProp.get(parentElement, parentProperties[targetIndex]);

    if(newElement) {
      newElement = getFirstEditableElementOf(newElement);
    }

    position = newElement._key;
  }

  return [position, inserting];
}

const getFirstEditableElementOf = (element) => {
  if(element.type in elementPropertyOrder) {
    const property = elementPropertyOrder[element.type][0];
    return getFirstEditableElementOf(dotProp.get(element, property));
  }
  return element;
}

const elementPropertyOrder = {
  VariableDeclaration: ["declarations.0.id", "declarations.0.init"],
  VariableDeclarator: ["id", "init"],
  ForStatement: ["init", "test", "update", "body"],
  BinaryExpression: ["left", "right"],
}
