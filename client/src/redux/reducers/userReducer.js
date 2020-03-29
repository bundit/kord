import { PUSH_LIB_ROUTE, SET_SC_USER } from "../actions/types";

const initialState = {
  soundcloud: {
    username: ""
  },
  spotify: {
    token: null,
    username: ""
  },
  youtube: {
    token: null,
    username: ""
  },
  mixcloud: {
    token: null,
    username: ""
  },
  history: {
    library: [],
    search: [],
    more: []
  }
};

export default function(state = initialState, action) {
  switch (action.type) {
    case PUSH_LIB_ROUTE: {
      const pathname = action.payload;
      const libHistory = state.history.library;

      if (pathname === libHistory[libHistory.length - 1]) {
        return state;
      }

      // If the path is the base then clear history
      const newLibHistory =
        pathname.toLowerCase() === "/library"
          ? ["/library"]
          : [...state.history.library, pathname];

      return {
        ...state,
        history: {
          ...state.history,
          library: newLibHistory
        }
      };
    }
    case "SET_SPOTIFY_ACCESS_TOKEN": {
      const spotifyAccessToken = action.payload;

      return {
        ...state,
        spotify: {
          token: spotifyAccessToken
        }
      };
    }
    case "SET_YOUTUBE_ACCESS_TOKEN": {
      const youtubeAccessToken = action.payload;

      return {
        ...state,
        youtube: {
          token: youtubeAccessToken
        }
      };
    }

    case "SET_MIXCLOUD_ACCESS_TOKEN": {
      const mixcloudAccessToken = action.payload;

      return {
        ...state,
        mixcloud: {
          token: mixcloudAccessToken
        }
      };
    }

    default:
      return state;
  }
}
