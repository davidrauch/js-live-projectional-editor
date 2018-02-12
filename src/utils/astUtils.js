import dotProp from 'dot-prop';

// from https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
export const guid = () => {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

const isNumber = (n) => !isNaN(parseFloat(n)) && !isNaN(n - 0)

export const joinKeys = (key1, key2) => {
  if(key1.length === 0) {
    return key2;
  } else if(key2.length === 0) {
    return key1
  } else {
    return `${key1}.${key2}`;
  }
}

export const parentKey = (key) => {
  let keyParts = key.split('.');
  const lastPart = keyParts.pop();
  // If the last part is a number, we have to remove one more part
  //if(isNumber(lastPart)) {
  //  keyParts.pop();
  //}
  return keyParts.join('.');
}

export const propertyOfKey = (key) => {
  let keyParts = key.split('.');
  const property = keyParts.pop();
  return property;
}

export const indexOfKey = (key) => {
  const index = propertyOfKey(key);
  if(isNumber(index)) {
    return +index;
  }
  return null;
}

export const assignKeys = (currentElement, key="") => {
  // Make sure this is an object
  if(!(currentElement instanceof Object) || !("type" in currentElement)) {
    return currentElement;
  }

  // Assign GUID
  currentElement._key = key;

  // Process all children
  for(let property in currentElement) {
    if(currentElement[property] instanceof Array) {
      for(let index in currentElement[property]) {
        if(currentElement[property][index] instanceof Object && "type" in currentElement[property][index]) {
          assignKeys(currentElement[property][index], joinKeys(key, `${property}.${index}`));
        }
      }
    } else if(currentElement[property] instanceof Object && "type" in currentElement[property]) {
      assignKeys(currentElement[property], joinKeys(key, property));
    }
  }

  return currentElement;
}

export const findElementWithKey = (ast, key) =>
  dotProp.get(ast, key)

export const findParentOfElementWithKey = (ast, key) => {
  return findElementWithKey(ast, parentKey(key))
}

export const clearProperties = (node) => {
  for(let key in node) {
    delete node[key];
  }
}
