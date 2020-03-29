import {
  SEARCH,
  SEARCH_ARTISTS,
  LOAD_MORE_RESULTS,
  SET_NEXT_HREF,
  ADD_TO_SEARCH_HISTORY
} from "../actions/types";

const initialState = {
  library: {
    songResults: [],
    artistResults: []
  },
  soundcloud: {
    songResults: [],
    artistResults: [],
    nextHref: null
  },
  spotify: {
    songResults: [],
    artistResults: [],
    nextHref: null
  },
  youtube: {
    songResults: [],
    nextHref: null
  },
  mixcloud: {
    songResults: []
  },
  history: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case "SEARCH_LIB_SONGS": {
      return {
        ...state,
        library: {
          songResults: action.payload
        }
      };
    }
    case "SEARCH_LIB_ARTISTS": {
      return {
        ...state,
        artistResults: action.payload
      };
    }
    case "SEARCH_SC_SONGS": {
      return {
        ...state,
        soundcloud: {
          songResults: action.payload
        }
      };
    }
    case "LOAD_MORE_SC_SONGS": {
      return {
        ...state,
        soundcloud: {
          songResults: [...state.soundcloud.songResults, ...action.payload]
        }
      };
    }
    case "SET_NEXT_SC_HREF": {
      return {
        ...state,
        soundcloud: {
          ...state.soundcloud,
          nextHref: action.payload
        }
      };
    }
    case "SEARCH_SC_ARTISTS": {
      return {
        ...state,
        soundcloud: {
          artistResults: action.payload
        }
      };
    }
    case "SEARCH_SPOTIFY_SONGS": {
      return {
        ...state,
        spotify: {
          songResults: action.payload
        }
      };
    }
    case "LOAD_MORE_SPOTIFY_SONGS": {
      return {
        ...state,
        spotify: {
          songResults: [...state.spotify.songResults, ...action.payload]
        }
      };
    }
    case "SEARCH_SPOTIFY_ARTISTS": {
      return {
        ...state,
        spotify: {
          artistResults: action.payload
        }
      };
    }
    case "SEARCH_YOUTUBE_SONGS": {
      return {
        ...state,
        youtube: {
          songResults: action.payload
        }
      };
    }
    case "LOAD_MORE_YOUTUBE_SONGS": {
      return {
        ...state,
        youtube: {
          songResults: [...state.youtube.songResults, ...action.payload]
        }
      };
    }
    case "SEARCH_MIXCLOUD_SONGS": {
      return {
        ...state,
        mixcloud: {
          songResults: action.payload
        }
      };
    }
    case "LOAD_MORE_MIXCLOUD_SONGS": {
      return {
        ...state,
        mixcloud: {
          songResults: [...state.mixcloud.songResults, ...action.payload]
        }
      };
    }
    case ADD_TO_SEARCH_HISTORY: {
      return {
        ...state,
        history: [action.payload, ...state.history]
      };
    }
    default:
      return state;
  }
}
