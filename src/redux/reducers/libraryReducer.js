import {
  IMPORT_SC_LIKES,
  SET_LIB_QUERY,
  RESET_LIB_QUERY,
  IMPORT_SONG,
  TOGGLE_NEW_PLAYLIST_FORM,
  TOGGLE_ADD_PLAYLIST_FORM,
  ADD_TO_PLAYLISTS,
  SET_NEW_PLAYLIST_NAME,
  CREATE_NEW_PLAYLIST
} from "../actions/types";
import compareSongs from "../../utils/compareSongs";
import compareArtists from "../../utils/compareArtists";

const initialState = {
  query: "",
  library: [],
  artists: [],
  playlists: {},
  genres: [],
  isNewPlaylistFormOpen: false,
  isAddToPlaylistFormOpen: true,
  newPlaylistName: "",
  currentAddToPlaylistSong: ""
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

      let i = 0;
      let compare = 1;

      // Find alphabetical position of new song and insert it in place
      while (i < newLib.length) {
        compare = compareSongs(newSong, newLib[i]);

        // Song already exists in library
        if (compare === 0) {
          break;

          // else if song fits in this position
        } else if (compare < 0) {
          newLib.splice(i, 0, newSong);
          break;

          // Else song goes after this position, continue =>
        } else if (compare > 0) i += 1;
      }

      // We reached the end of the list, song goes at the end
      // We may also reach this condition if the list is empty
      if (i === newLib.length) {
        newLib.push(newSong);
      }

      i = 0;
      compare = 1;

      // Iterate through the list of artists to insert the new artist at the correct position
      while (i < newArtistList.length) {
        compare = compareArtists(newArtist, newArtistList[i]);

        // Artist already exists
        if (compare === 0) {
          // Append the result incase there is a new source (soundcloud, spotify, etc)
          newArtistList[i] = {
            ...newArtistList[i],
            ...newArtist
          };
          break;

          // Else if position found
        } else if (compare < 0) {
          newArtistList.splice(i, 0, newArtist);
          break;

          // Else artist goes after this position, continue =>
        } else if (compare > 0) i += 1;
      }

      // We reached the end of the list, artist goes at the end
      // We may also reach this condition if the list is empty
      if (i === newArtistList.length) {
        newArtistList.push(newArtist);
      }

      return {
        ...state,
        library: newLib,
        artists: newArtistList,
        // Don't add empty genres
        genres:
          newGenre.length > 0
            ? [...new Set([...state.genres, newGenre])].sort()
            : state.genres
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
        currentAddToPlaylistSong: action.payload
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
          list: [...prevList.list, state.currentAddToPlaylistSong]
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

    default:
      return state;
  }
}
