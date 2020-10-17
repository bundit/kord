import {
  DEQUE_ROUTE,
  PUSH_LIB_ROUTE,
  REMOVE_PROFILE,
  SAVE_ROUTE,
  SET_ACCESS_TOKEN,
  SET_CONNECTION,
  SET_CURRENT_TRACK_DROPDOWN,
  SET_KORD_ID,
  SET_MAIN_CONNECTION,
  SET_PROFILE,
  SET_SETTINGS_OPEN_STATUS,
  SET_SETTINGS_SOURCE,
  TOGGLE_ADD_TO_PLAYLIST_FORM,
  TOGGLE_DELETE_TRACK_FORM,
  TOGGLE_KEYBOARD_CONTROLS_MENU,
  TOGGLE_USER_QUEUE
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
    library: ["/app/library"],
    search: ["/app/search"],
    explore: ["/app/explore"]
  },
  settings: {
    isSettingsOpen: false,
    settingsSource: "",
    isAddToPlaylistFormOpen: false,
    isDeleteTrackFormOpen: false,
    currentTrackDropdown: null,
    isUserQueueOpen: false,
    isKeyboardControlsOpen: false
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

      if (route === `/app/${relativeRoute}`) {
        return {
          ...state,
          history: {
            ...state.history,
            [relativeRoute]: [route]
          }
        };
      }

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

    case DEQUE_ROUTE: {
      const relativeRoute = action.payload;
      const pathname = action.pathname;
      const currentHistory = state.history[relativeRoute];

      const currentPathIndex = currentHistory.findIndex(
        path => path === pathname
      );

      return {
        ...state,
        history: {
          ...state.history,
          [relativeRoute]: currentHistory.slice(currentPathIndex + 1)
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

    case TOGGLE_USER_QUEUE: {
      const isUserQueueOpen = state.settings.isUserQueueOpen;

      return {
        ...state,
        settings: {
          ...state.settings,
          isUserQueueOpen: !isUserQueueOpen
        }
      };
    }

    case TOGGLE_KEYBOARD_CONTROLS_MENU: {
      const isKeyboardControlsOpen = state.settings.isKeyboardControlsOpen;

      return {
        ...state,
        settings: {
          ...state.settings,
          isKeyboardControlsOpen: !isKeyboardControlsOpen
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
