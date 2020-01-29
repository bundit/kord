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
    music: {
      library: state.music.library,
      artists: state.music.artists,
      genres: state.music.genres,
      playlists: state.music.playlists
    },
    user: {
      soundcloud: {
        key: state.user.soundcloud.key,
        username: state.user.soundcloud.username
      },
      spotify: {
        token: state.user.spotify.token
      },
      history: {
        library: state.user.history.library
      }
    }
  });
});

export default store;
