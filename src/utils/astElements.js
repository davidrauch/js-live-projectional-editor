/*
import types from "ast-types";

const def = types.Type.def;

def("Missing").bases("Node");

types.finalize();

const b = types.builders;
*/

const missing = () => Object.assign({}, {"type": "Missing"})

class Element {
  static shortcut = ""
  static description = ""
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
  static generate = (operator) => ({
    "type": "BinaryExpression",
    "left": missing(),
    "operator": operator,
    "right": missing(),
  })
}

export class Addition extends BinaryExpression {
  static shortcut = "add"
  static description = "Addition"
  static generate = () => BinaryExpression.generate('+')
}

export class Subtraction extends BinaryExpression {
  static shortcut = "sub"
  static description = "Subtraction"
  static generate = () => BinaryExpression.generate('-')
}

export class Multiplication extends BinaryExpression {
  static shortcut = "mul"
  static description = "Multiplication"
  static generate = () => BinaryExpression.generate('*')
}

export class Division extends BinaryExpression {
  static shortcut = "div"
  static description = "Division"
  static generate = () => BinaryExpression.generate('/')
}

export class VariableDeclaration extends Element {
  static shortcut = "let"
  static description = "Variable Declaration"
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
  static shortcut = "for"
  static description = "For Loop"
  static editableFields = ["init", "test", "update", "body"]
  static generate = () => ({
    "type": "ForStatement",
    "init": missing(),
    "test": missing(),
    "update": missing(),
    "body": {
      "type": "BlockStatement",
      "body": []
    }
  })
}

export class UpdateExpression extends Element {
  static editableFields = ["argument"]
  static generate = (operator, prefix=false) => ({
    "type": "UpdateExpression",
    "operator": operator,
    "argument": missing(),
    "prefix": prefix,
  })
}

export class Increment extends UpdateExpression {
  static shortcut = "inc"
  static description = "Increment"
  static generate = () => UpdateExpression.generate("++")
}

export class Decrement extends UpdateExpression {
  static shortcut = "dec"
  static description = "Decrement"
  static generate = () => UpdateExpression.generate("--")
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
