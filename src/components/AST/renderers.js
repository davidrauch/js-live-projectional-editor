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
  <div className="Missing">?!</div>

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
  <span className="ForStatement">
    <span className="init"><ASTNode node={node.init} /></span>
    <span className="test"><ASTNode node={node.test} /></span>
    <span className="update"><ASTNode node={node.update} /></span>
    <ASTList node={node} childrenPath="body.body" />
  </span>

export const Identifier = (node) =>
  GenericInline(node.name, node.type)

export const Result = (result) =>
  GenericInline(`${result[0]}(${result[1]})`, "Result")

export const Literal = (node) =>
  GenericInline(node.value, node.type)

export const VariableDeclaration = (node) =>
  <span className="VariableDeclaration">
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

export const CallExpression = (node) =>
  <span className="CallExpression">
    <span className="callee"><ASTNode node={node.callee}/></span>
    <span className="arguments"><ASTList node={node} childrenPath="arguments" inline={true}/></span>
  </span>

export const MemberExpression = (node) =>
  <span className={node.type}>
    <span className="object"><ASTNode node={node.object}/></span>
    <span className="property"><ASTNode node={node.property}/></span>
  </span>

export const Comment = (node) =>
  <span className={node.type}>
    <span className="text">{node.text}</span>
  </span>
