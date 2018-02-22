import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as inputActions from '../../actions/inputActions';
import React from 'react';
import './InputBar.css';

class InputBar extends React.Component {

  render() {
    return (
      <div className={"inputBar" + (this.props.inline ? " inline" : "")}>
        <div className="inputContainer">
          <input
            name="search-field"
          	value={this.props.value}
            placeholder="Input..."
            autoFocus
            onClick={e => e.stopPropagation()}
            onChange={this.props.inputActions.change}
            onKeyDown={this.onKeyDown.bind(this)}
          />
      </div>
        <ul className="suggestionList">
          {this.renderSuggestionList()}
        </ul>
      </div>
    );
  }

  renderSuggestionList() {
    return (
      this.props.filteredSuggestions.map((suggestion, index) =>
        <li className={index === this.props.selection ? "selected" : ""} key={suggestion.name+suggestion.element}>
          <span className="name">{suggestion.name}</span>
          <span className="description">{suggestion.description}</span>
        </li>
      )
    );
  }

  onKeyDown(event) {
    switch(event.key) {
      case "ArrowDown":
        event.preventDefault();
        this.props.inputActions.nextSuggestion();
        break;
      case "ArrowUp":
        event.preventDefault();
        this.props.inputActions.prevSuggestion();
        break;
      case "Space":
      case " ":
      case "Enter":
      case "Tab":
        // Allow space in comments and strings
        if(["Space", " "].indexOf(event.key) !== -1 && this.props.value.match(/(\/\/|").*/)) {
          break;
        }
        event.preventDefault();
        const selection = this.props.filteredSuggestions[this.props.selection];
        if(selection) {
          this.props.inputActions.confirm(
            selection,
            this.props.position,
            this.props.inserting,
          );
        } else {
          this.props.inputActions.next();
        }
        break;
      case "Escape":
        event.preventDefault();
        this.props.inputActions.hide();
        break;
      default:
        return;
    }
  }
}

function mapStateToProps(state) {
  return {
    value: state.input.value,
    filteredSuggestions: state.input.filteredSuggestions,
    selection: state.input.selection,
    position: state.input.position,
    inserting: state.input.inserting,
    inline: state.input.inline
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
)(InputBar);
