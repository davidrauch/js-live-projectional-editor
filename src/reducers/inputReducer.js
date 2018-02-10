import initialState from './initialState';
import * as types from '../actions/actionTypes';

export default function input(state = initialState.input, action) {
  switch (action.type) {
    case types.INPUT_VALUE_CHANGED:
      return {
        ...state,
        value: action.newValue,
        selection: 0,
        filteredSuggestions: filterSuggestions(state.suggestions, action.newValue),
      };
    case types.INPUT_NEXT_SUGGESTION:
      return {...state, selection: state.selection + 1};
    case types.INPUT_PREV_SUGGESTION:
      return {...state, selection: state.selection - 1};
    case types.INPUT_POSITION_CHANGED:
      return {
        ...state,
        position: action.newPosition,
        value: "",
        selection: 0,
        filteredSuggestions: filterSuggestions(state.suggestions, ""),
      };
    case types.INPUT_CONFIRM:
      return state;
    case types.INPUT_NEXT:
      return {...state, index: state.index + 1};
    case types.INPUT_HIDE:
      return {...state, position: hiddenPosition}
    default:
      return state;
  }
}

const hiddenPosition = {
  key: null,
  property: null,
  index: null
}

const filterSuggestions = (suggestions, filter) =>
  filter.length > 0 ?
    suggestions.filter(suggestion =>
      suggestion.name.toLowerCase().indexOf(filter.toLowerCase()) === 0 ||
      suggestion.description.toLowerCase().indexOf(filter.toLowerCase()) !== -1
    )
    :
    []
