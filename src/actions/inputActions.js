import * as types from './actionTypes';

export const change = (event) => ({
  type: types.INPUT_VALUE_CHANGED,
  newValue: event.target.value
})

export const nextSuggestion = () => ({
  type: types.INPUT_NEXT_SUGGESTION
})

export const prevSuggestion = () => ({
  type: types.INPUT_PREV_SUGGESTION
})

export const confirm = (selection, position) => ({
  type: types.INPUT_CONFIRM,
  selection: selection,
  position: position,
})

export const positionChanged = (newPosition) => ({
  type: types.INPUT_POSITION_CHANGED,
  newPosition: newPosition,
})

export const hide = () => ({
  type: types.INPUT_HIDE,
})
