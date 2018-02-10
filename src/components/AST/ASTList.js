import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as inputActions from '../../actions/inputActions';
import ASTNode from './ASTNode';
import InputBar from '../InputBar/InputBar';
import InputPlaceholder from '../InputBar/InputPlaceholder';
import {guid} from '../../utils/astUtils';
import dotProp from 'dot-prop'

class ASTList extends React.Component {

  render = () => {
    const childNodes = dotProp.get(this.props.node, this.props.childrenPath);
    const myPosition = {
      key: this.props.node._key,
      property: this.props.childrenPath,
      index: 0,
    }

    // Generate list of children
    let children = [];
    for(let i = 0; i < childNodes.length; i++) {
      const child = childNodes[i];
      children.push(
        <InputPlaceholder key={guid()} position={{...myPosition, index: i}}/>,
        <div className="ASTBlock" key={child._key}>
          <ASTNode node={child} />
        </div>
      )
    }
    children.push(<InputPlaceholder key={guid()} position={{...myPosition, index: childNodes.length}}/>);

    // Show InputBar if necessary
    if(this.props.inputPosition.key === myPosition.key &&
      this.props.inputPosition.property === myPosition.property &&
      typeof this.props.inputPosition.index === "number") {
      children[this.props.inputPosition.index * 2] = <InputBar key="inputBar"/>;
    }

    return (
      <div className="GenericBody">
        {children}
      </div>
    )
  }

}

const mapStateToProps = (state) => ({
  inputPosition: state.input.position
})

const mapDispatchToProps = (dispatch) => ({
  inputActions: bindActionCreators(inputActions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ASTList);
