import React from 'react';
import ASTNode from './ASTNode';
import ASTList from './ASTList';

export function Generic(node) {
  const renderProperties = (node) => {
    const renderProperty = (property) => {
      if(property instanceof Array) {
        return property.map(step => <ASTNode node={step} />);
      } else if(property instanceof Object) {
        return <ASTNode node={property} />;
      } else {
        return property;
      }
    };

    return Object.keys(node).map(key => {
      return <div>{key}: {renderProperty(node[key])}</div>;
    });
  }

  return renderProperties(node);
}

export const GenericInline = (child, type, className="") =>
  <span className={"" + type + " " + className}>
    {child}
  </span>


export const GenericContainer = (child, type, className="") =>
  <span className={"" + type + " " + className}>
    <ASTNode node={child} />
  </span>

export const Missing = (node) =>
  <div className="missing hue-5-2">?!</div>

export const AssignmentExpression = (node) =>
  <span className="AssignmentExpression">
    <ASTNode node={node.left} /> {node.operator} <ASTNode node={node.right} />
  </span>

export const BinaryExpression = (node) =>
  <span className="BinaryExpression">
    <ASTNode node={node.left} /> {node.operator} <ASTNode node={node.right} />
  </span>

export const ExpressionStatement = (node) =>
  GenericContainer(node.expression, node.type)

export const ForStatement = (node) =>
  <span className="ForStatement hue-3">
    <ASTNode node={node.init} />
    <ASTNode node={node.test} />
    <ASTNode node={node.update} />
    <ASTList node={node} childrenPath="body.body" />
  </span>

export const Identifier = (node) =>
  GenericInline(node.name, node.type, "hue-2")

export const Literal = (node) =>
  GenericInline(node.value, node.type)

export const VariableDeclaration = (node) =>
  <span className="VariableDeclaration hue-6-2">
    {node.kind} <ASTNode node={node.declarations[0].id} /> = <ASTNode node={node.declarations[0].init} />
  </span>

export const Program = (node) =>
  <span className="Program">
    <div>Program:</div>
    <ASTList node={node} childrenPath="body" />
  </span>

export const UpdateExpression = (node) =>
  node.prefix?
    <span className="UpdateExpression">
      {node.operator}<ASTNode node={node.argument} />
    </span>
    :
    <span className="UpdateExpression">
      <ASTNode node={node.argument} />{node.operator}
    </span>
