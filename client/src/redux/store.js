import { applyMiddleware, createStore, compose } from "redux";
import thunk from "redux-thunk";

import { loadState } from "../utils/localStorage";
import { synchronizeDataStore } from "./sync";
import rootReducer from "./reducers";

const persistedState = loadState();
const middlewares = [thunk];

const composeEnhancers =
  (process.env.NODE_ENV !== "production" &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;

const store = createStore(
  rootReducer,
  persistedState,
  composeEnhancers(applyMiddleware(...middlewares))
);

synchronizeDataStore(store);

export default store;
