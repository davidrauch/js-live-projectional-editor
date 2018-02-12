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

export const confirm = (selection, position, inserting) => ({
  type: types.INPUT_CONFIRM,
  selection: selection,
  position: position,
  inserting: inserting,
})

export const positionChanged = (newPosition, isInserting) => ({
  type: types.INPUT_POSITION_CHANGED,
  newPosition: newPosition,
  isInserting: isInserting,
})

export const next = () => ({
  type: types.INPUT_NEXT,
})

export const hide = () => ({
  type: types.INPUT_HIDE,
})
