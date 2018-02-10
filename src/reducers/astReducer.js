import initialState from './initialState';
import * as types from '../actions/actionTypes';
import * as generators from '../utils/astGenerators';
import dotProp from 'dot-prop'

export default function ast(state = initialState.ast, action) {
  switch(action.type) {
    case types.INPUT_CONFIRM:
      return insert(
        Object.assign({}, state),
        action.selection.element,
        action.position
      );
    default:
      return state;
  }
}

function insert(ast, element, position) {
  if(!(element in generators)) {
    return ast;
  }

  const newElement = generators[element]();

  // TODO: Add some kind of key/path cache to avoid this search
  const findElementWithKey = (currentElement, key) => {
    // Make sure this is an object
    if(!(currentElement instanceof Object) || !("type" in currentElement)) {
      return null;
    }

    // Check if this is the element
    if(currentElement._key && currentElement._key === key) {
      return currentElement;
    }

    // Search all children
    let foundElement = null
    for(let property in currentElement) {
      if(currentElement[property] instanceof Array) {
        for(let index in currentElement[property]) {
          if(currentElement[property][index] instanceof Object && "type" in currentElement[property][index]) {
            foundElement = findElementWithKey(currentElement[property][index], key);
            if(foundElement) {
              return foundElement;
            }
          }
        }
      } else if(currentElement[property] instanceof Object && "type" in currentElement[property]) {
        foundElement = findElementWithKey(currentElement[property], key);
        if(foundElement) {
          return foundElement;
        }
      }
    }

    return null;
  };

  const foundElement = findElementWithKey(ast, position.key);
  if(foundElement) {
    let target = dotProp.get(foundElement, position.property);
    if(target instanceof Array && position.index) {
      target.splice(position.index, 0, newElement);
    } else {
      //TODO: Clear existing properties?
      Object.assign(foundElement, newElement);
    }
  }

  return ast;
}
