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
        inserting: action.isInserting,
        inline: action.isInline,
        value: "",
        selection: 0,
        filteredSuggestions: filterSuggestions(state.suggestions, ""),
      };
    case types.INPUT_CONFIRM:
      return {
        ...state,
        value: "",
        selection: 0,
        filteredSuggestions: filterSuggestions(state.suggestions, ""),
      };
    case types.INPUT_NEXT:
      return {...state, position: {...state.position, index: state.position.index+1}};
    case types.INPUT_HIDE:
      return {...state, position: "body.0", inserting: true}
    default:
      return state;
  }
}

const filterSuggestions = (suggestions, filter) => {
  if(filter.length === 0) {
    return [];
  }

  // Filter the suggestions
  let filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.name.toLowerCase().indexOf(filter.toLowerCase()) === 0 ||
    suggestion.description.toLowerCase().indexOf(filter.toLowerCase()) !== -1
  )

  // Add Identifier and Literal options
  const insertIndex = suggestions.length > 0 ? 1 : 0;
  const insertSuggestions = [
    { name: filter, description: "Identifier", element: "Identifier" },
    { name: filter, description: "Literal", element: "Literal" },
  ]
  filteredSuggestions.splice(insertIndex, 0, ...insertSuggestions);

  return filteredSuggestions;
}
