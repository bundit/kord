import {
  IMPORT_SC_LIKES,
  SET_LIB_QUERY,
  RESET_LIB_QUERY,
  IMPORT_SONG
} from "../actions/types";
import compareSongs from "../../utils/compareSongs";

const initialState = {
  query: "",
  library: [],
  playlists: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case IMPORT_SC_LIKES: {
      const newLib = [...state.library, ...action.payload].sort(
        (track1, track2) => track1.title.localeCompare(track2.title)
      );

      return {
        ...state,
        library: newLib
      };
    }

    case SET_LIB_QUERY: {
      return {
        ...state,
        query: action.payload
      };
    }

    case RESET_LIB_QUERY: {
      return {
        ...state,
        query: ""
      };
    }

    case IMPORT_SONG: {
      const newLib = state.library;
      const newSong = action.payload;
      const { length } = newLib;

      let i = 0;
      let compare = 1;

      while (i < length && compare > 0) {
        compare = compareSongs(newSong, newLib[i]);
        i += 1;
      }

      if (compare === 0) return state;

      newLib.splice(i, 0, newSong);

      return {
        ...state,
        library: newLib
      };
    }

    default:
      return state;
  }
}
