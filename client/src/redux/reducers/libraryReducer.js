const initialState = {
  playlists: {
    spotify: [],
    soundcloud: [],
    youtube: [],
    mixcloud: []
  }
};

export default function(state = initialState, action) {
  switch (action.type) {
    case "IMPORT_LIKES": {
      let likes = action.payload;
      const source = action.source;
      const playlistsOfThisSource = state.playlists[source].slice() || [];
      const firstPlaylist = playlistsOfThisSource[0];
      let rest;
      if (firstPlaylist && firstPlaylist.id === "likes") {
        rest = state.playlists[source].slice(1);
        likes = {
          ...firstPlaylist,
          ...likes,
          isConnected: firstPlaylist.isConnected,
          tracks: [...firstPlaylist.tracks, ...likes.tracks]
        };
      } else rest = playlistsOfThisSource;
      return {
        ...state,
        playlists: {
          ...state.playlists,
          [source]: [likes, ...rest]
        }
      };
    }

    case "IMPORT_PLAYLISTS": {
      const newPlaylists = action.payload;
      const source = action.source;
      const prevPlaylists = state.playlists[source].slice();

      // Combine previously loaded playlists with new playlists
      // Going by order given by source, our new index may not match the last time request was made
      const newAndOldCombined = newPlaylists.map(newPlaylist => {
        const prevIndex = prevPlaylists.findIndex(
          prevList => prevList.id === newPlaylist.id
        );
        // If prevIndex found, set it to the state we had before
        if (prevIndex !== -1) {
          newPlaylist = prevPlaylists[prevIndex];
        }
        return newPlaylist;
      });

      const firstPlaylist = prevPlaylists[0];
      if (firstPlaylist && firstPlaylist.id === "likes") {
        newAndOldCombined.unshift(firstPlaylist);
      }

      return {
        ...state,
        playlists: {
          ...state.playlists,
          [source]: newAndOldCombined
        }
      };
    }

    case "IMPORT_PLAYLIST_TRACKS": {
      const { source, playlistId } = action;
      const loadedTracks = action.payload;

      const newPlaylistList = state.playlists[source].map(playlist => {
        if (playlist.id === playlistId) {
          playlist.tracks = [...playlist.tracks, ...loadedTracks];
        }

        return playlist;
      });

      return {
        ...state,
        playlists: {
          ...state.playlists,
          [source]: newPlaylistList
        }
      };
    }

    case "SET_NEXT_PLAYLIST_HREF": {
      const { source, playlistId } = action;
      const nextHref = action.payload;

      const newPlaylistList = state.playlists[source].map(playlist => {
        if (playlist.id === playlistId) {
          playlist.next = nextHref;
        }

        return playlist;
      });

      return {
        ...state,
        playlists: {
          ...state.playlists,
          [source]: newPlaylistList
        }
      };
    }

    case "SET_PLAYLIST_CONNECTIONS": {
      const source = action.source;
      const newSettings = action.payload;
      const updateSettings = state.playlists[source].slice();

      newSettings.forEach(updated => {
        const index = updateSettings.findIndex(old => old.id === updated.id);
        updateSettings[index].isConnected = updated.isConnected;
      });

      return {
        ...state,
        playlists: {
          ...state.playlists,
          [source]: updateSettings
        }
      };
    }

    case "MOVE_PLAYLISTS_TO_TRASH": {
      const source = action.payload;
      const playlists = state.playlists[source];

      return {
        ...state,
        playlists: {
          ...state.playlists,
          [source]: []
        },
        trash: {
          [source]: playlists
        }
      };
    }

    case "RESTORE_PLAYLISTS_FROM_TRASH": {
      const source = action.payload;
      const playlists = state.trash[source];

      return {
        ...state,
        playlists: {
          ...state.playlists,
          [source]: playlists || []
        },
        trash: null
      };
    }

    case "CLEAR_TRASH": {
      const source = action.payload;

      return {
        ...state,
        trash: {
          [source]: null
        }
      };
    }

    default:
      return state;
  }
}
