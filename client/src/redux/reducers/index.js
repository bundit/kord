import { combineReducers } from "redux";
import libraryReducer from "./libraryReducer";
import searchReducer from "./searchReducer";
import musicPlayerReducer from "./musicPlayerReducer";
import userReducer from "./userReducer";

export default combineReducers({
  music: libraryReducer,
  search: searchReducer,
  musicPlayer: musicPlayerReducer,
  user: userReducer
});
