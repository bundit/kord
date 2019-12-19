import { PUSH_LIB_ROUTE, SET_SC_USER } from "../actions/types";

const initialState = {
  soundcloud: {
    key: null,
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
          ? []
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
