import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";

import { loadState, saveState } from "../utils/localStorage";
import rootReducer from "./reducers";

const persistedState = loadState();
const middlewares = [thunk];

const store = createStore(
  rootReducer,
  persistedState,
  applyMiddleware(...middlewares)
);

store.subscribe(() => {
  const state = store.getState();
  // Store the library in localStorage
  saveState({
    library: state.library,
    user: {
      ...state.user,
      history: {
        library: ["/app/library"],
        search: [],
        more: []
      }
    },
    player: {
      ...state.player,
      isPlaying: false,
      seek: 0,
      context: state.player.context
    },
    search: {
      history: state.search.history
    }
  });
});

export default store;
