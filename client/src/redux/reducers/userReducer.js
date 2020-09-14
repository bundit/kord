import {
  PUSH_LIB_ROUTE,
  REMOVE_PROFILE,
  SAVE_ROUTE,
  SET_ACCESS_TOKEN,
  SET_CONNECTION,
  SET_CURRENT_PAGE,
  SET_CURRENT_TRACK_DROPDOWN,
  SET_KORD_ID,
  SET_MAIN_CONNECTION,
  SET_PROFILE,
  SET_SETTINGS_OPEN_STATUS,
  SET_SETTINGS_SOURCE,
  TOGGLE_ADD_TO_PLAYLIST_FORM,
  TOGGLE_DELETE_TRACK_FORM
} from "../actions/types";

const profileInitialState = {
  isConnected: false,
  username: null,
  image: null,
  profileUrl: null,
  token: null
};

const initialState = {
  kord: {
    id: null,
    mainConnection: null
  },
  soundcloud: profileInitialState,
  spotify: profileInitialState,
  youtube: profileInitialState,
  mixcloud: profileInitialState,
  history: {
    library: [],
    search: [],
    more: [],
    currentPage: ""
  },
  settings: {
    isSettingsOpen: false,
    settingsSource: "",
    isAddToPlaylistFormOpen: false,
    isDeleteTrackFormOpen: false,
    currentTrackDropdown: null
  }
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_KORD_ID: {
      const kordId = action.payload;

      return {
        ...state,
        kord: {
          ...state.kord,
          id: kordId
        }
      };
    }

    case SET_ACCESS_TOKEN: {
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

    case SET_CONNECTION: {
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

    case SET_MAIN_CONNECTION: {
      const source = action.payload;

      return {
        ...state,
        kord: {
          ...state.kord,
          mainConnection: source
        }
      };
    }

    case SET_PROFILE: {
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

    case REMOVE_PROFILE: {
      const source = action.payload;

      return {
        ...state,
        [source]: { ...profileInitialState }
      };
    }

    case SAVE_ROUTE: {
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

    case SET_CURRENT_PAGE: {
      const currentPage = action.payload;

      return {
        ...state,
        history: {
          ...state.history,
          currentPage: currentPage
        }
      };
    }

    case SET_SETTINGS_OPEN_STATUS: {
      const isOpen = action.payload;

      return {
        ...state,
        settings: {
          ...state.settings,
          isSettingsOpen: isOpen
        }
      };
    }

    case SET_SETTINGS_SOURCE: {
      const source = action.payload;

      return {
        ...state,
        settings: {
          ...state.settings,
          settingsSource: source
        }
      };
    }

    case TOGGLE_ADD_TO_PLAYLIST_FORM: {
      const isAddToPlaylistFormOpen = state.settings.isAddToPlaylistFormOpen;

      return {
        ...state,
        settings: {
          ...state.settings,
          isAddToPlaylistFormOpen: !isAddToPlaylistFormOpen
        }
      };
    }

    case TOGGLE_DELETE_TRACK_FORM: {
      const isDeleteTrackFormOpen = state.settings.isDeleteTrackFormOpen;

      return {
        ...state,
        settings: {
          ...state.settings,
          isDeleteTrackFormOpen: !isDeleteTrackFormOpen
        }
      };
    }

    case SET_CURRENT_TRACK_DROPDOWN: {
      const currentTrack = action.payload;

      return {
        ...state,
        settings: {
          ...state.settings,
          currentTrackDropdown: currentTrack
        }
      };
    }

    default:
      return state;
  }
}
