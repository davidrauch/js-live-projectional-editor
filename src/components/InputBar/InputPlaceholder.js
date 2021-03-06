import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as inputActions from '../../actions/inputActions';
import './InputPlaceholder.css'

class InputPlaceholder extends React.Component {

  render = () =>
    <div
      className={"InputPlaceholder clickTarget " + (this.props.inline ? "inline" : "")}
      onClick={this.onClick}>
    </div>

  onClick = (event) => {
    event.stopPropagation();
    return this.props.inputActions.positionChanged(this.props.position, true, this.props.inline);
  }

}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch) => ({
  inputActions: bindActionCreators(inputActions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InputPlaceholder);
