import initialState from './initialState';
import * as types from '../actions/actionTypes';
import {
  assignKeys,
  indexOfKey,
  findElementWithKey,
  findParentOfElementWithKey,
  clearProperties,
} from '../utils/astUtils';
import * as elements from '../utils/astElements';

export default function astReducer(state = initialState.ast, action) {
  switch(action.type) {
    case types.INPUT_CONFIRM:
      if(!action.selection) {
        return state;
      }

      return add(
        Object.assign({}, state),
        action.selection.element,
        action.selection.name,
        action.position,
        action.inserting,
      );
    default:
      return state;
  }
}

function add(ast, element, name, position, inserting) {
  if(!(element in elements) || elements[element].generate === null) {
    return ast;
  }

  const newElement = elements[element].generate(name);

  // Generators may return null if input was invalid
  if(newElement === null) {
    return ast;
  }

  if(inserting) {
    const index = indexOfKey(position);
    const targetArray = findParentOfElementWithKey(ast, position);
    targetArray.splice(index, 0, newElement);
  } else {
    const targetElement = findElementWithKey(ast, position);
    clearProperties(targetElement);
    Object.assign(targetElement, newElement);
  }

  //TODO: Don't update all keys everytime
  assignKeys(ast);

  return ast;
}
