import {builders as b} from "../lib/ast-types";

const missing = () => Object.assign({}, {"type": "Missing"})

class Element {
  static shortcut = ""
  static description = ""
  static editableFields = []
  static generate = null
}

export class Identifier extends Element {
  static generate = b.identifier
}

export class Literal extends Element {
  static generate = (rawValue) => {
    let parsedValue;
    // Check for number
    parsedValue = parseFloat(rawValue);
    if(!isNaN(parsedValue)) {
      return b.literal(parsedValue);
    }
    // Check for string
    parsedValue = rawValue.match(/"(.*)"/);
    if(parsedValue.length > 1) {
      return b.literal(parsedValue[1]);
    }
    return null;
  }
}

export class BinaryExpression extends Element {
  static editableFields = ["left", "right"]
  static generate = (operator) => b.binaryExpression(operator, missing(), missing())
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
  static generate = () => b.variableDeclaration(
    "let",
    [b.variableDeclarator(missing(), missing())]
  )
}

export class VariableDeclarator extends Element {
  static editableFields = ["id", "init"]
}

export class ForStatement extends Element {
  static shortcut = "for"
  static description = "For Loop"
  static editableFields = ["init", "test", "update", "body"]
  static generate = () => b.forStatement(
    missing(), missing(), missing(), b.blockStatement([])
  )
}

export class UpdateExpression extends Element {
  static editableFields = ["argument"]
  static generate = (operator, prefix=false) => b.updateExpression(
    operator, missing(), prefix
  )
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

export class CallExpression extends Element {
  static shortcut = "call"
  static description = "Function Call"
  static editableFields = ["callee", "arguments"]
  static generate = () => b.expressionStatement(
    b.callExpression(
      missing(), []
    )
  )
}

export class MemberExpression extends Element {
  static shortcut = "mem"
  static description = "Member Expression"
  static editableFields = ["object", "property"]
  static generate = () => b.memberExpression(
    missing(), missing()
  )
}

export class Comment extends Element {
  static generate = (text) => ({
    type: "Comment",
    text: text.match(/\/\/ *(.*)/)[1]
  })
}
