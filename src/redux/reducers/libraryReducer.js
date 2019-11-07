import { IMPORT_SC_LIKES, IMPORT_SC_SONG } from "../actions/types";

const initialState = {
  library: [],
  playlists: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
