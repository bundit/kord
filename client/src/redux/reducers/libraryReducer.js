import {
  ADD_TRACK_TO_PLAYLIST,
  CLEAR_PLAYLIST_TRACKS,
  CLEAR_TRASH,
  IMPORT_LIKES,
  IMPORT_PLAYLISTS,
  IMPORT_PLAYLIST_TRACKS,
  MOVE_PLAYLISTS_TO_TRASH,
  REMOVE_TRACK_FROM_PLAYLIST,
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
      let newPlaylists = action.payload;
      const source = action.source;
      const prevPlaylists = state.playlists[source]
        .slice() // filter lists that are not returned in new list
        .filter(
          playlist =>
            newPlaylists.findIndex(list => list.id === playlist.id) !== -1 ||
            playlist.id === "likes"
        );

      const newAndOldCombined = prevPlaylists.map(playlist => {
        const newIndex = newPlaylists.findIndex(
          list => list.id === playlist.id
        );

        if (newIndex !== -1) {
          playlist = {
            ...playlist,
            total: newPlaylists[newIndex].total,
            title: newPlaylists[newIndex].title,
            img: newPlaylists[newIndex].img
          };

          newPlaylists = newPlaylists.filter(list => list.id !== playlist.id);
        }

        return playlist;
      });

      if (newPlaylists.length) {
        newAndOldCombined.push(...newPlaylists);
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

    case ADD_TRACK_TO_PLAYLIST: {
      const { playlistId, payload: trackToAdd } = action;
      const { source } = trackToAdd;

      return {
        ...state,
        playlists: {
          ...state.playlists,
          [source]: state.playlists[source].map(playlist => {
            const isLikes = playlistId === "likes";

            if (playlist.id === playlistId) {
              playlist = {
                ...playlist,
                tracks: isLikes ? [trackToAdd, ...playlist.tracks] : [],
                total: playlist.total + 1,
                next: isLikes ? playlist.next : "start"
              };
            }
            return playlist;
          })
        }
      };
    }

    case REMOVE_TRACK_FROM_PLAYLIST: {
      const { playlistId, index, payload: trackToRemove } = action;
      const source = trackToRemove.source;

      return {
        ...state,
        playlists: {
          ...state.playlists,
          [source]: state.playlists[source].map(playlist => {
            if (playlist.id === playlistId) {
              playlist = {
                ...playlist,
                total: playlist.total - 1,
                tracks: playlist.tracks.filter((track, i) => {
                  // eslint-disable-next-line
                  if (track.id == trackToRemove.id && index === i) {
                    return false;
                  }
                  return true;
                })
              };
            }
            return playlist;
          })
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
