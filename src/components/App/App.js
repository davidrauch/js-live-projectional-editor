import React, { Component } from 'react';
import './App.css';
import AST from "../AST/AST";

type Props = {}

class App extends Component<Props> {
  render() {
    return (
      <div className="app">
        <AST />
      </div>
    );
  }
}

export default App;
