import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers";
import { loadState, saveState } from "../localStorage";

const persistedState = loadState();
const middlewares = [thunk];

const store = createStore(
  rootReducer,
  persistedState,
  applyMiddleware(...middlewares)
);

store.subscribe(() => {
  // Store the library in localStorage
  saveState({
    music: {
      library: store.getState().music.library
    }
  });
});

export default store;
