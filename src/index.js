import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App/App';
import configureStore from './store/configureStore';
import {Provider} from 'react-redux';


const store = configureStore();
const root = document.getElementById('root')

if(root) {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    root
  );
}
