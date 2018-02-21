import {assignKeys} from "../utils/astUtils";
import * as elements from "../utils/astElements";

const initialAST = assignKeys({
  "type": "Program",
  "body": [
    {
      "type": "VariableDeclaration",
      "declarations": [
        {
          "type": "VariableDeclarator",
          "id": {
            "type": "Identifier",
            "name": "a"
          },
          "init": {
            "type": "BinaryExpression",
            "operator": "+",
            "left": {
              "type": "Literal",
              "value": 3,
              "raw": "3"
            },
            "right": {
              "type": "Literal",
              "value": 5,
              "raw": "5"
            }
          }
        }
      ],
      "kind": "let"
    },
    {
      "type": "VariableDeclaration",
      "declarations": [
        {
          "type": "VariableDeclarator",
          "id": {
            "type": "Identifier",
            "name": "b"
          },
          "init": {
            "type": "BinaryExpression",
            "operator": "*",
            "left": {
              "type": "Literal",
              "value": 100,
              "raw": "100"
            },
            "right": {
              "type": "BinaryExpression",
              "operator": "+",
              "left": {
                "type": "Literal",
                "value": 100,
                "raw": "100"
              },
              "right": {
                "type": "Identifier",
                "name": "a"
              }
            }
          }
        }
      ],
      "kind": "let"
    },
    {
      "type": "ForStatement",
      "init": {
        "type": "VariableDeclaration",
        "declarations": [
          {
            "type": "VariableDeclarator",
            "id": {
              "type": "Identifier",
              "name": "i"
            },
            "init": {
              "type": "Literal",
              "value": 0,
              "raw": "0"
            }
          }
        ],
        "kind": "let"
      },
      "test": {
        "type": "BinaryExpression",
        "operator": "<",
        "left": {
          "type": "Identifier",
          "name": "i"
        },
        "right": {
          "type": "Identifier",
          "name": "b"
        }
      },
      "update": {
        "type": "UpdateExpression",
        "operator": "++",
        "argument": {
          "type": "Identifier",
          "name": "i"
        },
        "prefix": false
      },
      "body": {
        "type": "BlockStatement",
        "body": [
          {
            "type": "ExpressionStatement",
            "expression": {
              "type": "AssignmentExpression",
              "operator": "=",
              "left": {
                "type": "Identifier",
                "name": "i"
              },
              "right": {
                "type": "BinaryExpression",
                "operator": "+",
                "left": {
                  "type": "Identifier",
                  "name": "i"
                },
                "right": {
                  "type": "Literal",
                  "value": 1,
                  "raw": "1"
                }
              }
            }
          }
        ]
      }
    }
  ],
  "sourceType": "module"
});

const initialSuggestions =
  Object.values(elements)
    .filter(e => e.shortcut.length > 0 && e.generate !== null)
    .map(e => ({
      name: e.shortcut,
      description: e.description,
      element: e.name,
    }))

const initialState = {
  input: {
    value: "",
    suggestions: initialSuggestions,
    filteredSuggestions: [],
    selection: 0,
    position: "body.0",
    inserting: true,
  },
  ast: initialAST,
};

export default initialState;
