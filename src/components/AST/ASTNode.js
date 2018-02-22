import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as inputActions from '../../actions/inputActions';
import * as renderers from './renderers';
import React from 'react';
import InputBar from '../InputBar/InputBar';
import './styles-colorful/ASTNode.css';

class ASTNode extends React.Component {

  render = () => {
    let content;

    if(this.props.inputPosition === this.props.node._key && !this.props.inputInserting) {
      return <InputBar key="inputBar"/>;
    } else if(this.props.node) {
      if(this.props.node.type in renderers) {
        content = renderers[this.props.node.type](this.props.node);
      } else {
        content = renderers.Generic(this.props.node);
      }
    }

    return (
      <span className="ASTNode"
        onClick={this.onClick.bind(this)} >
        {content}
      </span>
    )
  }

  onClick = (event) => {
    event.stopPropagation();
    if(this.props.node.type === "Program") {
      return this.props.inputActions.hide();
    }

    return this.props.inputActions.positionChanged(this.props.node._key, false, true);
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
)(ASTNode);
