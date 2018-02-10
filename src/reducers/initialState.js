const initialAST = {
  "_key": "0",
  "type": "Program",
  "body": [
    {
      "_key": "a",
      "type": "VariableDeclaration",
      "declarations": [
        {
          "_key": "b",
          "type": "VariableDeclarator",
          "id": {
            "_key": "c",
            "type": "Identifier",
            "name": "a"
          },
          "init": {
            "_key": "d",
            "type": "BinaryExpression",
            "operator": "+",
            "left": {
              "_key": "e",
              "type": "Literal",
              "value": 3,
              "raw": "3"
            },
            "right": {
              "_key": "f",
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
      "_key": "g",
      "type": "VariableDeclaration",
      "declarations": [
        {
          "_key": "h",
          "type": "VariableDeclarator",
          "id": {
            "_key": "i",
            "type": "Identifier",
            "name": "b"
          },
          "init": {
            "_key": "j",
            "type": "BinaryExpression",
            "operator": "*",
            "left": {
              "_key": "k",
              "type": "Literal",
              "value": 100,
              "raw": "100"
            },
            "right": {
              "_key": "l",
              "type": "BinaryExpression",
              "operator": "+",
              "left": {
                "_key": "m",
                "type": "Literal",
                "value": 100,
                "raw": "100"
              },
              "right": {
                "_key": "n",
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
      "_key": "o",
      "type": "ForStatement",
      "init": {
        "_key": "p",
        "type": "VariableDeclaration",
        "declarations": [
          {
            "_key": "q",
            "type": "VariableDeclarator",
            "id": {
              "_key": "r",
              "type": "Identifier",
              "name": "i"
            },
            "init": {
              "_key": "s",
              "type": "Literal",
              "value": 0,
              "raw": "0"
            }
          }
        ],
        "kind": "let"
      },
      "test": {
        "_key": "t",
        "type": "BinaryExpression",
        "operator": "<",
        "left": {
          "_key": "u",
          "type": "Identifier",
          "name": "i"
        },
        "right": {
          "_key": "v",
          "type": "Identifier",
          "name": "b"
        }
      },
      "update": {
        "_key": "w",
        "type": "UpdateExpression",
        "operator": "++",
        "argument": {
          "_key": "x",
          "type": "Identifier",
          "name": "i"
        },
        "prefix": false
      },
      "body": {
        "_key": "y",
        "type": "BlockStatement",
        "body": [
          {
            "_key": "z",
            "type": "ExpressionStatement",
            "expression": {
              "_key": "1",
              "type": "AssignmentExpression",
              "operator": "=",
              "left": {
                "_key": "2",
                "type": "Identifier",
                "name": "i"
              },
              "right": {
                "_key": "3",
                "type": "BinaryExpression",
                "operator": "+",
                "left": {
                  "_key": "4",
                  "type": "Identifier",
                  "name": "i"
                },
                "right": {
                  "_key": "5",
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
};

const initialState = {
  input: {
    value: "",
    suggestions: [
      { id: 1, name: "let", description: "Variable declaration", "element": "VariableDeclaration" },
      { id: 2, name: "if", description: "Condition", "element": "IfCondition" },
      { id: 3, name: "function", description: "Function declaration", "element": "FunctionDeclaration" },
      { id: 4, name: "lit", description: "Literal", "element": "Literal" },
    ],
    filteredSuggestions: [],
    selection: 0,
    position: {
      key: "i",
      property: null,
      index: null
    }
  },
  ast: initialAST,
};

export default initialState;
