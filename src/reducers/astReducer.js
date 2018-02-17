import initialState from './initialState';
import * as types from '../actions/actionTypes';
import * as generators from '../utils/astGenerators';
import {
  assignKeys,
  indexOfKey,
  findElementWithKey,
  findParentOfElementWithKey,
  clearProperties,
} from '../utils/astUtils';

export default function ast(state = initialState.ast, action) {
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
  if(!(element in generators)) {
    return ast;
  }

  const newElement = generators[element](name);

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
