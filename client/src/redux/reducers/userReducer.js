import { PUSH_LIB_ROUTE } from "../actions/types";

const initialState = {
  soundcloud: {
    isConnected: false,
    username: null,
    image: null,
    profileUrl: null
  },
  spotify: {
    isConnected: false,
    token: null,
    username: null,
    image: null,
    profileUrl: null,
    market: null
  },
  youtube: {
    isConnected: false,
    token: null,
    username: null,
    image: null,
    profileUrl: null
  },
  mixcloud: {
    isConnected: false,
    token: null,
    username: null,
    image: null,
    profileUrl: null
  },
  history: {
    library: [],
    search: [],
    more: []
  }
};

export default function(state = initialState, action) {
  switch (action.type) {
    case "SET_ACCESS_TOKEN": {
      const accessToken = action.payload;
      const source = action.source;

      return {
        ...state,
        [source]: {
          ...state[source],
          token: accessToken
        }
      };
    }
    case "SET_CONNECTION": {
      const isConnected = action.payload;
      const source = action.source;

      return {
        ...state,
        [source]: {
          ...state[source],
          isConnected
        }
      };
    }
    case "SET_PROFILE": {
      const source = action.source;
      const newProfile = action.payload;

      return {
        ...state,
        [source]: {
          ...state[source],
          ...newProfile
        }
      };
    }

    case "SAVE_ROUTE": {
      const route = action.payload;
      const relativeRoute = action.relativeRoute;
      const rootRoute = `/app/${relativeRoute}`;
      const currentHistory = state.history[relativeRoute] || [];
      const updatedHistory =
        route === rootRoute ? [route] : [route, ...currentHistory];

      return {
        ...state,
        history: {
          ...state.history,
          [relativeRoute]: updatedHistory
        }
      };
    }
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
    default:
      return state;
  }
}
