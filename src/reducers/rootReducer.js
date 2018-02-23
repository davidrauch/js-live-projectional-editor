import initialState from "./initialState";
import inputReducer from "./inputReducer";
import astReducer from "./astReducer";
import resultsReducer from "./resultsReducer"

export default function root(immutableState = initialState, action) {
  // Call specialized reducers
  return {
    ...immutableState,
    ast: astReducer(immutableState.ast, action),
    input: inputReducer(immutableState, action),
    results: resultsReducer(immutableState, action),
  };
}
