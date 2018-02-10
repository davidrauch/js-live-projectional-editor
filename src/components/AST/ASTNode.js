import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as inputActions from '../../actions/inputActions';
import * as renderers from './renderers';
import React from 'react';
import InputBar from '../InputBar/InputBar';
import './ASTNode.css';

class ASTNode extends React.Component {

  render = () => {
    let content;

    if(this.props.inputPosition.key === this.props.node._key &&
      !this.props.inputPosition.property) {
      return <InputBar key="inputBar" inline={true}/>;
    } else if(this.props.node) {
      if(this.props.node.type in renderers) {
        content = renderers[this.props.node.type](this.props.node);
      } else {
        content = renderers.Generic(this.props.node);
      }
    }

    return (
      <span className="ASTNode" onClick={this.onClick.bind(this)}>
        {content}
      </span>
    )
  }

  onClick = (event) => {
    event.stopPropagation();
    if(this.props.node.type === "Program") {
      return this.props.inputActions.hide();
    }

    return this.props.inputActions.positionChanged({
      key: this.props.node._key,
      property: null,
      index: null,
    });
  }

}

const mapStateToProps = (state) => ({
  inputPosition: state.input.position,
})

const mapDispatchToProps = (dispatch) => ({
  inputActions: bindActionCreators(inputActions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ASTNode);
