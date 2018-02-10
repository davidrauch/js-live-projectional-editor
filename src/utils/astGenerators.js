import {guid} from './astUtils';

const assignGUIDs = (currentElement) => {
  // Make sure this is an object
  if(!(currentElement instanceof Object) || !("type" in currentElement)) {
    return currentElement;
  }

  // Assign GUID
  currentElement._key = guid();

  // Process all children
  for(let property in currentElement) {
    if(currentElement[property] instanceof Array) {
      for(let index in currentElement[property]) {
        if(currentElement[property][index] instanceof Object && "type" in currentElement[property][index]) {
          assignGUIDs(currentElement[property][index]);
        }
      }
    } else if(currentElement[property] instanceof Object && "type" in currentElement[property]) {
      assignGUIDs(currentElement[property]);
    }
  }

  return currentElement;
}

export const VariableDeclaration = () => assignGUIDs({
  "type": "VariableDeclaration",
  "declarations": [
    {
      "type": "VariableDeclarator",
      "id": {
        "type": "Identifier",
        "name": "inserted"
      },
      "init": {
        "type": "Missing"
      }
    }
  ],
  "kind": "let"
})

export const Literal = () => assignGUIDs({
  "type": "Literal",
  "value": 1,
  "raw": "1"
})
