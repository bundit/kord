import {
  CLEAR_PLAYLIST_TRACKS,
  CLEAR_TRASH,
  IMPORT_LIKES,
  IMPORT_PLAYLISTS,
  IMPORT_PLAYLIST_TRACKS,
  MOVE_PLAYLISTS_TO_TRASH,
  RESTORE_PLAYLISTS_FROM_TRASH,
  SET_NEXT_PLAYLIST_HREF,
  SET_PLAYLIST_CONNECTIONS,
  SET_TRACK_UNSTREAMABLE
} from "../actions/types";

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
    case IMPORT_LIKES: {
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

    case IMPORT_PLAYLISTS: {
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
          newPlaylist = {
            ...prevPlaylists[prevIndex],
            total: newPlaylist.total,
            title: newPlaylist.title,
            img: newPlaylist.img
          };
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

    case IMPORT_PLAYLIST_TRACKS: {
      const { source, playlistId } = action;
      const loadedTracks = action.payload;

      const newPlaylistList = state.playlists[source].map(playlist => {
        //eslint-disable-next-line
        if (playlist.id == playlistId) {
          const playlistIsEmpty = !playlist.tracks || !playlist.tracks.length;
          if (playlistIsEmpty) {
            playlist.dateSynced = new Date();
          }

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

    case SET_NEXT_PLAYLIST_HREF: {
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

    case SET_PLAYLIST_CONNECTIONS: {
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

    case CLEAR_PLAYLIST_TRACKS: {
      const source = action.source;
      const playlistId = action.payload;

      const updatedPlaylists = state.playlists[source].map(playlist => {
        if (playlist.id === playlistId) {
          return {
            ...playlist,
            next: "start",
            tracks: [],
            dateSynced: new Date()
          };
        }
        return playlist;
      });

      return {
        ...state,
        playlists: {
          ...state.playlists,
          [source]: updatedPlaylists
        }
      };
    }

    case MOVE_PLAYLISTS_TO_TRASH: {
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

    case RESTORE_PLAYLISTS_FROM_TRASH: {
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

    case CLEAR_TRASH: {
      const source = action.payload;

      return {
        ...state,
        trash: {
          [source]: null
        }
      };
    }

    case SET_TRACK_UNSTREAMABLE: {
      const { source, id: playlistId } = action.context;
      const trackId = action.payload;

      if (playlistId === "search") {
        return state;
      }

      const updatedPlaylists = state.playlists[source].map(playlist => {
        // eslint-disable-next-line
        if (playlist.id == playlistId) {
          playlist.tracks = playlist.tracks.map(track => {
            // eslint-disable-next-line
            if (track.id == trackId) {
              track.streamable = false;
            }
            return track;
          });
        }
        return playlist;
      });

      return {
        ...state,
        playlists: {
          ...state.playlists,
          [source]: updatedPlaylists
        }
      };
    }

    default:
      return state;
  }
}
