import initialState from "./initialState";
import inputReducer from "./inputReducer";
import astReducer from "./astReducer";
import resultsReducer from "./resultsReducer"
import * as types from "../actions/actionTypes";
import {
  findElementWithKey,
  findParentOfElementWithKey,
  parentKey,
  propertyOfKey,
  indexOfKey,
  joinKeys,
} from "../utils/astUtils";
import * as elements from "../utils/astElements";
import dotProp from "dot-prop";

export default function root(state = initialState, action) {
  // Call specialized reducers
  let newState = {
    ...state,
    ast: astReducer(state.ast, action),
    input: inputReducer(state.input, action),
    results: resultsReducer(state, action),
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
      return [joinKeys(element._path, `${property}.0`), true];
    }
    return getFirstEditableChildElementOf(nextElement);
  }
  return [element._path, false];
}

const getNextEditableParentElementOf = (element, ast) => {
  let searchProperty = propertyOfKey(element._path);
  const keyOfParent = parentKey(element._path);
  let parentElement = findElementWithKey(ast, keyOfParent);

  if(parentElement instanceof Array) {
    //TODO: Remove exception for VariableDeclaration
    if(findParentOfElementWithKey(ast, keyOfParent) &&
      findParentOfElementWithKey(ast, keyOfParent).type === "VariableDeclaration") {
      parentElement = findParentOfElementWithKey(ast, keyOfParent);
      searchProperty = "declarations.0.init";
    } else {
      const currentIndex = indexOfKey(element._path);
      const newPosition = joinKeys(keyOfParent, currentIndex+1);
      return [newPosition, true];
    }
  }

  const parentProperties = elements[parentElement.type].editableFields;
  const targetIndex = parentProperties.indexOf(searchProperty) + 1;

  if(targetIndex >= parentProperties.length) {
    return getNextEditableParentElementOf(parentElement, ast);
  } else {
    const newKey = joinKeys(parentElement._path, parentProperties[targetIndex]);
    if(findElementWithKey(ast, newKey) instanceof Array) {
      return [joinKeys(newKey, 0), true];
    }
    return [newKey, false];
  }
}
