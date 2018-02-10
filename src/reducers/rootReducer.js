import {combineReducers} from 'redux';
import input from './inputReducer';
import ast from './astReducer';

const rootReducer = combineReducers({
  input,
  ast
});

export default rootReducer;
