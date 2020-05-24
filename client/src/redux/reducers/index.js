import { combineReducers } from "redux";

import libraryReducer from "./libraryReducer";
import playerReducer from "./playerReducer";
import searchReducer from "./searchReducer";
import userReducer from "./userReducer";

export default combineReducers({
  library: libraryReducer,
  search: searchReducer,
  player: playerReducer,
  user: userReducer
});
