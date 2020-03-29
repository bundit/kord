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
    library: {
      songs: state.library.songs,
      artists: state.library.artists,
      genres: state.library.genres,
      playlists: state.library.playlists
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
        library: ["/app/library"],
        search: [],
        more: []
      }
    }
  });
});

export default store;
