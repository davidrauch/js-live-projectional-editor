/*
import types from "ast-types";

const def = types.Type.def;

def("Missing").bases("Node");

types.finalize();

const b = types.builders;
*/

const missing = () => Object.assign({}, {"type": "Missing"})

class Element {
  static editableFields = []
  static generate = null
}

export class Identifier extends Element {
  static generate = (name) => ({
    "type": "Identifier",
    "name": name
  })
}

export class Literal extends Element {
  static generate = (value) => ({
    "type": "Literal",
    "value": value,
    "raw": value
  })
}

export class BinaryExpression extends Element {
  static editableFields = ["left", "right"]
  static generate = () => ({
    "type": "BinaryExpression",
    "left": missing(),
    "operator": "+",
    "right": missing(),
  })
}

export class VariableDeclaration extends Element {
  static editableFields = ["declarations.0.id", "declarations.0.init"]
  static generate = () => ({
    "type": "VariableDeclaration",
    "declarations": [
      {
        "type": "VariableDeclarator",
        "id": missing(),
        "init": missing(),
      }
    ],
    "kind": "let"
  })

}

export class VariableDeclarator extends Element {
  static editableFields = ["id", "init"]
}

export class ForStatement extends Element {
  static editableFields = ["init", "test", "update", "body"]
}

export class UpdateExpression extends Element {
  static editableFields = ["argument"]
}

export class Increment extends UpdateExpression {
  static generate = () => ({
    "type": "UpdateExpression",
    "operator": "++",
    "argument": missing(),
    "prefix": false
  })
}

export class Decrement extends UpdateExpression {
  static generate = () => ({
    "type": "UpdateExpression",
    "operator": "--",
    "argument": missing(),
    "prefix": false
  })
}

export class BlockStatement extends Element {
  static editableFields = ["body"]
}

export class ExpressionStatement extends Element {
  static editableFields = ["expression"]
}

export class AssignmentExpression extends Element {
  static editableFields = ["left", "right"]
}
