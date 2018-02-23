import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as inputActions from '../../actions/inputActions';
import ASTNode from './ASTNode';
import InputBar from '../InputBar/InputBar';
import InputPlaceholder from '../InputBar/InputPlaceholder';
import {
  joinPaths,
  parentPath,
  indexOfPath,
  guid
} from '../../utils/astUtils';
import dotProp from 'dot-prop'

class ASTList extends React.Component {

  render = () => {
    const childNodes = dotProp.get(this.props.node, this.props.childrenPath);
    const myPosition = joinPaths(this.props.node._path, this.props.childrenPath);

    // Generate list of children
    let children = [];
    for(let i = 0; i < childNodes.length; i++) {
      const child = childNodes[i];
      children.push(
        <InputPlaceholder
          key={guid()}
          position={joinPaths(myPosition, i)}
          inline={this.props.inline}
        />,
        this.props.inline ?
          <ASTNode node={child} key={child._path}/>
          :
          <div className="ASTBlock" key={child._path}>
            <ASTNode node={child} />
          </div>
      )
    }
    children.push(
      <InputPlaceholder
        key={guid()}
        position={joinPaths(myPosition, childNodes.length)}
        inline={this.props.inline}
      />
    );

    // Show InputBar if necessary
    if(parentPath(this.props.inputPosition) === myPosition && this.props.inputInserting) {
      children[indexOfPath(this.props.inputPosition) * 2] = <InputBar key="inputBar"/>;
    }

    return (
      <div className={this.props.inline ? "InlineBody" : "GenericBody"}>
        {children}
      </div>
    )
  }

}

const mapStateToProps = (state) => ({
  inputPosition: state.input.position,
  inputInserting: state.input.inserting,
})

const mapDispatchToProps = (dispatch) => ({
  inputActions: bindActionCreators(inputActions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ASTList);
