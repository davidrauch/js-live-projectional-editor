import initialState from "./initialState";
import * as types from "../actions/actionTypes";
import dotProp from "dot-prop";

import {
  findElementWithPath,
  findParentOfElementWithPath,
  parentPath,
  propertyOfKey,
  indexOfPath,
  joinPaths,
  textCanBeElement
} from "../utils/astUtils";
import * as elements from "../utils/astElements";

export default function inputReducer(immutableState = initialState, action) {
  let immutableInput = immutableState.input;

  switch (action.type) {
    case types.INPUT_VALUE_CHANGED:
      return {
        ...immutableInput,
        value: action.newValue,
        selection: 0,
        filteredSuggestions: filterSuggestions(immutableInput.suggestions, action.newValue),
      };
    case types.INPUT_NEXT_SUGGESTION:
      return {...immutableInput, selection: immutableInput.selection + 1};
    case types.INPUT_PREV_SUGGESTION:
      return {...immutableInput, selection: immutableInput.selection - 1};
    case types.INPUT_POSITION_CHANGED:
      return {
        ...immutableInput,
        position: action.newPosition,
        inserting: action.isInserting,
        inline: action.isInline,
        value: "",
        selection: 0,
        filteredSuggestions: filterSuggestions(immutableInput.suggestions, ""),
      };
    case types.INPUT_NEXT:
    case types.INPUT_CONFIRM:
      const [position, inserting] = inputNext(immutableState);
      return {
        ...immutableInput,
        value: "",
        selection: 0,
        filteredSuggestions: filterSuggestions(immutableInput.suggestions, ""),
        position: position,
        inserting: inserting,
        inline: !inserting // TODO: This does not work for inline inserting
      };
    case types.INPUT_HIDE:
      return {...immutableInput, position: "", inserting: true, inline: false}
    default:
      return immutableInput;
  }
}

const filterSuggestions = (suggestions, filter) => {
  if(filter.length === 0) {
    return [];
  }

  // Filter the suggestions
  let filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.name.toLowerCase().indexOf(filter.toLowerCase()) === 0 ||
    suggestion.description.toLowerCase().indexOf(filter.toLowerCase()) !== -1
  )

  // Add Identifier, Literal and Comment options
  const insertIndex = suggestions.length > 0 ? 1 : 0;
  const insertSuggestions = [
    { name: filter, description: "Identifier", element: "Identifier" },
    { name: filter, description: "Literal", element: "Literal" },
    { name: filter, description: "Comment", element: "Comment" },
  ].filter(e => textCanBeElement(filter, e.element));

  filteredSuggestions.splice(insertIndex, 0, ...insertSuggestions);

  return filteredSuggestions;
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
      currentElement = findElementWithPath(state.ast, parentPath(parentPath(position)));
      [position, inserting] = getNextEditableParentElementOf(currentElement, state.ast);
    }
  } else {
    // Try to move into the current element
    let tmpPosition;
    [tmpPosition, inserting] = getFirstEditableChildElementOf(findElementWithPath(state.ast, position));
    if(tmpPosition !== position) {
      return [tmpPosition, inserting];
    }

    [position, inserting] = getNextEditableParentElementOf(currentElement, state.ast);

    if(!inserting) {
      [position, inserting] = getFirstEditableChildElementOf(findElementWithPath(state.ast, position));
    }
  }

  return [position, inserting];
}

const getFirstEditableChildElementOf = (element) => {
  if(element.type in elements && elements[element.type].editableFields.length > 0) {
    const property = elements[element.type].editableFields[0];
    const nextElement = dotProp.get(element, property);
    if(nextElement instanceof Array) {
      return [joinPaths(element._path, `${property}.0`), true];
    }
    return getFirstEditableChildElementOf(nextElement);
  }
  return [element._path, false];
}

const getNextEditableParentElementOf = (element, ast) => {
  let searchProperty = propertyOfKey(element._path);
  const keyOfParent = parentPath(element._path);
  let parentElement = findElementWithPath(ast, keyOfParent);

  if(parentElement instanceof Array) {
    //TODO: Remove exception for VariableDeclaration
    if(findParentOfElementWithPath(ast, keyOfParent) &&
      findParentOfElementWithPath(ast, keyOfParent).type === "VariableDeclaration") {
      parentElement = findParentOfElementWithPath(ast, keyOfParent);
      searchProperty = "declarations.0.init";
    } else {
      const currentIndex = indexOfPath(element._path);
      const newPosition = joinPaths(keyOfParent, currentIndex+1);
      return [newPosition, true];
    }
  }

  const parentProperties = elements[parentElement.type].editableFields;
  const targetIndex = parentProperties.indexOf(searchProperty) + 1;

  if(targetIndex >= parentProperties.length) {
    return getNextEditableParentElementOf(parentElement, ast);
  } else {
    const newKey = joinPaths(parentElement._path, parentProperties[targetIndex]);
    if(findElementWithPath(ast, newKey) instanceof Array) {
      return [joinPaths(newKey, 0), true];
    }
    return [newKey, false];
  }
}
