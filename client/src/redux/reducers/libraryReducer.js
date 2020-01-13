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
  EDIT_TRACK,
  DELETE_TRACK,
  TOGGLE_DELETE_TRACK_FORM
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
  isDeleteTrackFormOpen: false,
  newPlaylistName: "",
  trackDropdownSelected: undefined
};

export default function(state = initialState, action) {
  switch (action.type) {
    case IMPORT_SC_LIKES: {
      const newLib = [...state.library, ...action.payload]
        .sort((track1, track2) => compareSongs(track1, track2))
        .filter(
          (track, index, arr) =>
            arr.findIndex(element => track.id === element.id) === index
        );

      const newArtists = [...state.artists, ...newLib.map(song => song.artist)]
        .sort((artist1, artist2) => compareArtists(artist1, artist2))
        .filter(
          (artist, index, arr) =>
            arr.findIndex(element => compareArtists(artist, element) === 0) ===
            index
        );

      const newGenres = [...state.genres, ...newLib.map(song => song.genre)]
        .sort((genre1, genre2) => compareGenres(genre1, genre2))
        .filter(
          (genre, index, arr) =>
            genre &&
            genre.length &&
            arr.findIndex(element => compareGenres(genre, element) === 0) ===
              index
        );

      return {
        ...state,
        library: newLib,
        artists: newArtists,
        genres: newGenres
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
      const { library, artists, trackDropdownSelected, genres } = state;
      const {
        artist: { name: oldArtistName }
      } = trackDropdownSelected;

      const updatedArtist = {
        ...trackDropdownSelected.artist,
        ...artistEdit
      };

      const updatedTrack = {
        ...trackDropdownSelected,
        ...trackEdit,
        artist: updatedArtist
      };

      // Remove the old track and insert new one
      const index = library.findIndex(
        track => compareSongs(track, trackDropdownSelected) === 0
      );
      const updatedLib = library.slice();
      updatedLib.splice(index, 1);

      insertInPlace(updatedLib, updatedTrack, compareSongs);

      // Update artist list if a change was made
      // We don't slice here incase no changes need to be made, the old reference can be used
      let updatedArtistList = artists;
      if (oldArtistName !== artistEdit.name) {
        if (!artists.find(artist => artist.name === artistEdit.name)) {
          // Only create a new reference if changes need to be made
          updatedArtistList = artists.slice();
          insertInPlace(updatedArtistList, updatedArtist, compareArtists);
        }
      }

      // Update list of genres
      const updatedGenres = [...genres.slice(), trackEdit.genre]
        .sort((genre1, genre2) => compareGenres(genre1, genre2))
        .filter(
          (genre, i, arr) =>
            genre &&
            genre.length &&
            arr.findIndex(element => compareGenres(genre, element) === 0) === i
        );

      return {
        ...state,
        library: updatedLib,
        artists: updatedArtistList,
        genres: updatedGenres
      };
    }

    case TOGGLE_DELETE_TRACK_FORM: {
      return {
        ...state,
        trackDropdownSelected: action.payload,
        isDeleteTrackFormOpen: !state.isDeleteTrackFormOpen
      };
    }

    case DELETE_TRACK: {
      const deleteTrackID = state.trackDropdownSelected.id;
      const deleteArtist = state.trackDropdownSelected.artist;
      const { library, artists } = state;

      const updatedLib = library.filter(track => track.id !== deleteTrackID);
      // We don't create a new reference here incase the artist list
      // does not need to be changed.
      let updatedArtists = artists;

      // If no other song with this artist exists
      // Delete it
      if (
        !updatedLib.some(
          song => compareArtists(song.artist, deleteArtist) === 0
        )
      ) {
        updatedArtists = artists.filter(
          artist => compareArtists(artist, deleteArtist) !== 0
        );
      }

      return {
        ...state,
        library: updatedLib,
        artists: updatedArtists
      };
    }

    default:
      return state;
  }
}
