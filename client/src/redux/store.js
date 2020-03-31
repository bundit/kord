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
    }
  });
});

export default store;
