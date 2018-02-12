export const VariableDeclaration = () => ({
  "type": "VariableDeclaration",
  "declarations": [
    {
      "type": "VariableDeclarator",
      "id": { "type": "Missing" },
      "init": { "type": "Missing" }
    }
  ],
  "kind": "let"
})

export const Literal = (name) => ({
  "type": "Literal",
  "value": name,
  "raw": name
})

export const Identifier = (name) => ({
  "type": "Identifier",
  "name": name
})
