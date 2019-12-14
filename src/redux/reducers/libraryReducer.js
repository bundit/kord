import {
  IMPORT_SC_LIKES,
  SET_LIB_QUERY,
  RESET_LIB_QUERY,
  IMPORT_SONG,
  TOGGLE_NEW_PLAYLIST_FORM,
  TOGGLE_ADD_PLAYLIST_FORM,
  ADD_TO_PLAYLISTS,
  SET_NEW_PLAYLIST_NAME,
  CREATE_NEW_PLAYLIST,
  TOGGLE_EDIT_TRACK_FORM,
  EDIT_TRACK
} from "../actions/types";
import insertInPlace from "../../utils/insertInPlace";
import compareSongs from "../../utils/compareSongs";
import compareArtists from "../../utils/compareArtists";
import compareGenres from "../../utils/compareGenres";

const initialState = {
  query: "",
  library: [],
  artists: [],
  playlists: {},
  genres: [],
  isNewPlaylistFormOpen: false,
  isAddToPlaylistFormOpen: false,
  isEditTrackFormOpen: false,
  newPlaylistName: "",
  trackDropdownSelected: undefined
};

export default function(state = initialState, action) {
  switch (action.type) {
    case IMPORT_SC_LIKES: {
      const newLib = [...state.library, ...action.payload].sort(
        (track1, track2) => track1.title.localeCompare(track2.title)
      );

      let i = 0;
      // Remove song duplicates
      while (i < newLib.length - 1) {
        const song1 = newLib[i];
        const song2 = newLib[i + 1];
        if (compareSongs(song1, song2) === 0) {
          newLib.splice(i, 1);
        } else {
          i += 1;
        }
      }

      const newArtists = newLib
        .map(song => song.artist)
        .sort((artist1, artist2) => compareArtists(artist1, artist2));

      i = 0;
      // Remove artist duplicates
      while (i < newArtists.length - 1) {
        const artist1 = newArtists[i];
        const artist2 = newArtists[i + 1];
        if (compareArtists(artist1, artist2) === 0) {
          newArtists.splice(i, 1);
        } else {
          i += 1;
        }
      }

      return {
        ...state,
        library: newLib,
        artists: newArtists
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
      const newArtistList = state.artists;
      const newSong = action.payload;
      const newArtist = newSong.artist;
      const newGenre = newSong.genre;
      const newGenreList = state.genres;

      // Ignore duplicates
      if (state.library.some(track => track.id === newSong.id)) {
        return state;
      }

      insertInPlace(newLib, newSong, compareSongs);
      insertInPlace(newArtistList, newArtist, compareArtists);
      if (newGenre && newGenre.length) {
        insertInPlace(newGenreList, newGenre, compareGenres);
      }

      return {
        ...state,
        library: newLib,
        artists: newArtistList,
        genres: newGenreList
      };
    }

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

    case CREATE_NEW_PLAYLIST: {
      return {
        ...state,
        playlists: {
          ...state.playlists,
          [action.payload]: {
            title: action.payload,
            list: []
          }
        }
      };
    }

    case TOGGLE_ADD_PLAYLIST_FORM: {
      return {
        ...state,
        isAddToPlaylistFormOpen: !state.isAddToPlaylistFormOpen,
        trackDropdownSelected: action.payload
      };
    }

    case ADD_TO_PLAYLISTS: {
      const newPlaylists = {};
      const playlistsToAddTo = action.payload;

      playlistsToAddTo.forEach(title => {
        // If is falsy, create a new playlist instead
        const prevList = state.playlists[title] || { title, list: [] };

        newPlaylists[title] = {
          ...prevList,
          list: [...prevList.list, state.trackDropdownSelected]
        };
      });

      return {
        ...state,
        playlists: {
          ...state.playlists,
          ...newPlaylists
        }
      };
    }

    case TOGGLE_EDIT_TRACK_FORM: {
      return {
        ...state,
        isEditTrackFormOpen: !state.isEditTrackFormOpen,
        trackDropdownSelected: action.payload
      };
    }

    case EDIT_TRACK: {
      const { trackEdit, artistEdit } = action.payload;
      const { library, trackDropdownSelected } = state;

      const updatedTrack = {
        ...trackDropdownSelected,
        ...trackEdit,
        artist: {
          ...trackDropdownSelected.artist,
          artistEdit
        }
      };

      // Remove the old track
      const index = library.findIndex(
        track => compareSongs(track, trackDropdownSelected) === 0
      );
      const updatedLib = library.slice();
      updatedLib.splice(index, 1);

      insertInPlace(updatedLib, updatedTrack, compareSongs);

      return {
        ...state,
        library: updatedLib
      };
    }

    default:
      return state;
  }
}
