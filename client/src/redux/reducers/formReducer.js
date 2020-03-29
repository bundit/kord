import {
  RESET_QUERY,
  SET_NEW_PLAYLIST_NAME,
  SET_QUERY,
  TOGGLE_ADD_PLAYLIST_FORM,
  TOGGLE_DELETE_TRACK_FORM,
  TOGGLE_EDIT_TRACK_FORM,
  TOGGLE_NEW_PLAYLIST_FORM
} from "../actions/types";

const initialState = {
  query: "",
  newPlaylistName: "",
  trackDropdownSelected: undefined,
  isImportPlaylistFormOpen: false,
  isNewPlaylistFormOpen: false,
  isAddToPlaylistFormOpen: false,
  isEditTrackFormOpen: false,
  isDeleteTrackFormOpen: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case TOGGLE_NEW_PLAYLIST_FORM: {
      return {
        ...state,
        isNewPlaylistFormOpen: !state.isNewPlaylistFormOpen
      };
    }

    case SET_NEW_PLAYLIST_NAME: {
      return {
        ...state,
        newPlaylistName: action.payload
      };
    }

    case TOGGLE_ADD_PLAYLIST_FORM: {
      return {
        ...state,
        isAddToPlaylistFormOpen: !state.isAddToPlaylistFormOpen,
        trackDropdownSelected: action.payload
      };
    }
    case TOGGLE_EDIT_TRACK_FORM: {
      return {
        ...state,
        isEditTrackFormOpen: !state.isEditTrackFormOpen,
        trackDropdownSelected: action.payload
      };
    }
    case TOGGLE_DELETE_TRACK_FORM: {
      return {
        ...state,
        trackDropdownSelected: action.payload,
        isDeleteTrackFormOpen: !state.isDeleteTrackFormOpen
      };
    }
    case "TOGGLE_IMPORT_PLAYLIST_FORM": {
      return {
        ...state,
        isImportPlaylistFormOpen: !state.isImportPlaylistFormOpen
      };
    }

    case SET_QUERY: {
      return {
        ...state,
        query: action.payload
      };
    }

    case RESET_QUERY: {
      return {
        ...state,
        query: ""
      };
    }

    default: {
      return state;
    }
  }
}
