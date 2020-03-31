import { PUSH_LIB_ROUTE, SET_SC_USER } from "../actions/types";

const initialState = {
  soundcloud: {
    isConnected: false,
    username: ""
  },
  spotify: {
    isConnected: false,
    token: null,
    username: ""
  },
  youtube: {
    isConnected: false,
    token: null,
    username: ""
  },
  mixcloud: {
    isConnected: false,
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
    case "SET_USERNAME": {
      const username = action.payload;
      const source = action.source;

      return {
        ...state,
        [source]: {
          ...state[source],
          username: username
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
    default:
      return state;
  }
}
