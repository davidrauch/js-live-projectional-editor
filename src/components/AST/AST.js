import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as inputActions from '../../actions/inputActions';
import React from 'react';
import './AST.css';
import ASTNode from './ASTNode';

class AST extends React.Component {

  componentWillMount() {
    console.log("AST will mount");
  }

  render() {
    return (
      <div className="ast">
        <ASTNode node={this.props.ast} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    ast: state.ast
  };
}

function mapDispatchToProps(dispatch) {
  return {
    inputActions: bindActionCreators(inputActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AST);
