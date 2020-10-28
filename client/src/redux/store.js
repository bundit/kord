import { applyMiddleware, createStore, compose } from "redux";
import { initStateWithPrevTab } from "redux-state-sync";
import thunk from "redux-thunk";

import { loadState } from "../utils/localStorage";
import { synchronizeDataStore, tabSyncMiddleware } from "./sync";
import rootReducer from "./reducers";

const persistedState = loadState();
const middlewares = [thunk, tabSyncMiddleware()];

const composeEnhancers =
  (process.env.NODE_ENV !== "production" &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;

const store = createStore(
  rootReducer,
  persistedState,
  composeEnhancers(applyMiddleware(...middlewares))
);

initStateWithPrevTab(store); // redux-state-sync
synchronizeDataStore(store); // local state => server

export default store;
