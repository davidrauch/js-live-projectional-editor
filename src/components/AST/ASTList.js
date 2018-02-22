import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as inputActions from '../../actions/inputActions';
import ASTNode from './ASTNode';
import InputBar from '../InputBar/InputBar';
import InputPlaceholder from '../InputBar/InputPlaceholder';
import {
  joinKeys,
  parentKey,
  indexOfKey,
  guid
} from '../../utils/astUtils';
import dotProp from 'dot-prop'

class ASTList extends React.Component {

  render = () => {
    const childNodes = dotProp.get(this.props.node, this.props.childrenPath);
    const myPosition = joinKeys(this.props.node._key, this.props.childrenPath);

    // Generate list of children
    let children = [];
    for(let i = 0; i < childNodes.length; i++) {
      const child = childNodes[i];
      children.push(
        <InputPlaceholder
          key={guid()}
          position={joinKeys(myPosition, i)}
          inline={this.props.inline}
        />,
        this.props.inline ?
          <ASTNode node={child} key={child._key}/>
          :
          <div className="ASTBlock" key={child._key}>
            <ASTNode node={child} />
          </div>
      )
    }
    children.push(
      <InputPlaceholder
        key={guid()}
        position={joinKeys(myPosition, childNodes.length)}
        inline={this.props.inline}
      />
    );

    // Show InputBar if necessary
    if(parentKey(this.props.inputPosition) === myPosition && this.props.inputInserting) {
      children[indexOfKey(this.props.inputPosition) * 2] = <InputBar key="inputBar"/>;
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
