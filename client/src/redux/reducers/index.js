import { combineReducers } from "redux";

import { CLEAR_STATE } from "../actions/types";
import libraryReducer from "./libraryReducer";
import playerReducer from "./playerReducer";
import searchReducer from "./searchReducer";
import userReducer from "./userReducer";

const appReducer = combineReducers({
  library: libraryReducer,
  search: searchReducer,
  player: playerReducer,
  user: userReducer
});

const masterReducer = (state, action) => {
  if (action.type === CLEAR_STATE) {
    state = undefined;
  }

  return appReducer(state, action);
};

export default masterReducer;
