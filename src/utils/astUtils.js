import dotProp from "dot-prop";
import esTraverse from "estraverse";

export const customASTNodes = {
  Comment: ["text"],
  Missing: []
}

// from https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
export const guid = () => {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return  s4() + '-' + s4() + '-' + s4();
}

const isNumber = (n) => !isNaN(parseFloat(n)) && !isNaN(n - 0)

export const joinPaths = (path1, path2) => {
  if(path1.length === 0) {
    return path2;
  } else if(path2.length === 0) {
    return path1
  } else {
    return `${path1}.${path2}`;
  }
}

export const parentPath = (path) => {
  let pathParts = path.split('.');
  pathParts.pop();
  // If the last part is a number, we have to remove one more part
  //if(isNumber(lastPart)) {
  //  keyParts.pop();
  //}
  return pathParts.join('.');
}

export const propertyOfKey = (key) => {
  let keyParts = key.split('.');
  const property = keyParts.pop();
  return property;
}

export const indexOfPath = (path) => {
  const index = propertyOfKey(path);
  if(isNumber(index)) {
    return +index;
  }
  return null;
}

/**
 * Checks whether a given node can be an AST node
 */
const isASTNode = (immutableNode) =>
  (immutableNode instanceof Object) && ("type" in immutableNode)

/**
 * Recurvisely calls replaceCallback for the given node and all children,
 * replacing the current node with whatever the callback returns
 */
export const deepReplaceNodes = (mutableNode, replaceCallback) =>
  esTraverse.replace(mutableNode, {
    enter: (currentMutableNode) => replaceCallback(currentMutableNode),
    keys: customASTNodes
  });

/**
 * Assigns a key to the given node
 */
const assignKey = (mutableNode) => {
  mutableNode._key = guid()
  return mutableNode;
}

/**
 * Assigns unique keys to the given node and all children
 */
export const deepAssignKeys = (mutableNode) =>
  deepReplaceNodes(mutableNode, assignKey)



export const deepAssignPaths = (currentElement, path="") => {
  // Make sure this is an object
  if(!isASTNode(currentElement)) {
    return currentElement;
  }

  // Assign Path
  currentElement._path = path;

  // Process all children
  for(let property in currentElement) {
    if(currentElement[property] instanceof Array) {
      for(let index in currentElement[property]) {
        if(currentElement[property][index] instanceof Object && "type" in currentElement[property][index]) {
          deepAssignPaths(currentElement[property][index], joinPaths(path, `${property}.${index}`));
        }
      }
    } else if(currentElement[property] instanceof Object && "type" in currentElement[property]) {
      deepAssignPaths(currentElement[property], joinPaths(path, property));
    }
  }

  return currentElement;
}

export const findElementWithPath = (ast, key) =>
  dotProp.get(ast, key)

export const findParentOfElementWithPath = (ast, key) => {
  return findElementWithPath(ast, parentPath(key))
}

export const clearProperties = (node) => {
  for(let key in node) {
    delete node[key];
  }
}

export const textCanBeElement = (text, element) => {
  switch(element) {
    case "Comment":
      return text.indexOf("//") === 0;
    case "Literal":
      return isNumber(text) || text.indexOf("\"") === 0;
    case "Identifier":
      return text.indexOf("//") !== 0 && !isNumber(text) && text.indexOf("\"") !== 0;
    default:
      return false;
  }
}

export const deepCloneNode = (node) => {
  return JSON.parse(JSON.stringify(node));
}
