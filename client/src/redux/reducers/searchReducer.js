import { ADD_TO_SEARCH_HISTORY } from "../actions/types";

const initialState = {
  query: "",
  spotify: {
    tracks: {
      list: [],
      next: null
    },
    artists: []
  },
  soundcloud: {
    tracks: {
      list: [],
      next: null
    },
    artists: []
  },
  youtube: {
    tracks: {
      list: [],
      next: null
    }
  },
  mixcloud: {
    tracks: {
      list: [],
      next: null
    }
  },
  history: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case "SET_QUERY": {
      return {
        ...state,
        query: action.payload
      };
    }

    case "SET_TRACK_RESULTS": {
      const source = action.source;
      const trackResults = action.payload;
      return {
        ...state,
        [source]: {
          ...state[source],
          tracks: trackResults
        }
      };
    }

    case "SET_MORE_TRACK_RESULTS": {
      const source = action.source;
      const newTracks = action.payload;

      return {
        ...state,
        [source]: {
          ...state[source],
          tracks: {
            list: [...state[source].tracks.list, ...newTracks.list],
            next: newTracks.next
          }
        }
      };
    }

    case "SET_ARTIST_RESULTS": {
      const source = action.source;
      const artistResults = action.payload;
      return {
        ...state,
        [source]: {
          ...state[source],
          artists: artistResults
        }
      };
    }

    case ADD_TO_SEARCH_HISTORY: {
      const newQuery = action.payload;
      let history = state.history.slice();
      history = history.filter(query => query !== newQuery);

      return {
        ...state,
        history: [newQuery, ...history]
      };
    }

    default:
      return state;
  }
}
