import { IMPORT_SC_LIKES, IMPORT_SONG } from "../actions/types";
import compareSongs from "../../utils/compareSongs";

const initialState = {
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

    case IMPORT_SONG: {
      const newLib = state.library;
      const newSong = action.payload;
      const { length } = newLib;

      let i = 0;

      while (i < length && compareSongs(newSong, newLib[i]) > 0) i += 1;

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
