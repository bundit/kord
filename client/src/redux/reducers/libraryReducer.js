import {
  IMPORT_SONG,
  ADD_TO_PLAYLISTS,
  CREATE_NEW_PLAYLIST,
  EDIT_TRACK,
  DELETE_TRACK
} from "../actions/types";
import compareArtists from "../../utils/compareArtists";
import compareGenres from "../../utils/compareGenres";
import compareSongs from "../../utils/compareSongs";
import insertInPlace from "../../utils/insertInPlace";

const initialState = {
  songs: [],
  artists: [],
  playlists: {
    soundcloud: [],
    spotify: [],
    youtube: [],
    mixcloud: []
  },
  genres: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case "IMPORT_SONGS": {
      const newLib = [...state.songs, ...action.payload]
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
        songs: newLib,
        artists: newArtists,
        genres: newGenres
      };
    }

    case IMPORT_SONG: {
      const newLib = state.songs;
      const newArtistList = state.artists;
      const newSong = action.payload;
      const newArtist = newSong.artist;
      const newGenre = newSong.genre;
      const newGenreList = state.genres;

      // Ignore duplicates
      if (state.songs.some(track => track.id === newSong.id)) {
        return state;
      }

      insertInPlace(newLib, newSong, compareSongs);
      insertInPlace(newArtistList, newArtist, compareArtists);
      if (newGenre && newGenre.length) {
        insertInPlace(newGenreList, newGenre, compareGenres);
      }

      return {
        ...state,
        songs: newLib,
        artists: newArtistList,
        genres: newGenreList
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
    case EDIT_TRACK: {
      const { trackEdit, artistEdit } = action.payload;
      const { songs, artists, trackDropdownSelected, genres } = state;
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
      const index = songs.findIndex(
        track => compareSongs(track, trackDropdownSelected) === 0
      );
      const updatedLib = songs.slice();
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
        songs: updatedLib,
        artists: updatedArtistList,
        genres: updatedGenres
      };
    }

    case DELETE_TRACK: {
      const deleteTrackID = state.trackDropdownSelected.id;
      const deleteArtist = state.trackDropdownSelected.artist;
      const { songs, artists } = state;

      const updatedLib = songs.filter(track => track.id !== deleteTrackID);
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
        songs: updatedLib,
        artists: updatedArtists
      };
    }

    case "IMPORT_PLAYLISTS": {
      const newPlaylists = action.payload;
      const source = action.source;

      return {
        ...state,
        playlists: {
          [source]: newPlaylists
        }
      };
    }

    default:
      return state;
  }
}
