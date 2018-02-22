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
          "name": "a"
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
          },
          {
            callee: {
              object: {
                name: 'console',
                loc: null,
                type: 'Identifier',
                comments: null,
                optional: false,
                typeAnnotation: null,
                _key: 'body.3.callee.object'
              },
              property: {
                name: 'log',
                loc: null,
                type: 'Identifier',
                comments: null,
                optional: false,
                typeAnnotation: null,
                _key: 'body.3.callee.property'
              },
              computed: false,
              loc: null,
              type: 'MemberExpression',
              comments: null,
              _key: 'body.3.callee'
            },
            arguments: [
              {
                name: 'i',
                loc: null,
                type: 'Identifier',
                comments: null,
                optional: false,
                typeAnnotation: null,
                _key: 'body.3.arguments.0'
              }
            ],
            loc: null,
            type: 'CallExpression',
            comments: null,
            _key: 'body.3'
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
    inline: false,
  },
  ast: initialAST,
};

export default initialState;
