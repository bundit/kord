import { isEmptyObject } from "../../utils/compareHelpers";
import { mapListByIdAndIndex, reorder } from "../../utils/formattingHelpers";
import {
  ADD_TRACK_TO_PLAYLIST,
  CLEAR_PLAYLIST_TRACKS,
  CLEAR_TRASH,
  IMPORT_LIKES,
  IMPORT_PLAYLISTS,
  IMPORT_PLAYLIST_TRACKS,
  MOVE_PLAYLISTS_TO_TRASH,
  REMOVE_PLAYLISTS,
  REMOVE_TRACK_FROM_PLAYLIST,
  RESTORE_PLAYLISTS_FROM_TRASH,
  SET_NEXT_PLAYLIST_HREF,
  SET_PLAYLIST_SETTINGS,
  SET_TRACK_UNSTREAMABLE,
  TOGGLE_STAR_PLAYLIST
} from "../actions/types";

const initialState = {
  playlists: {
    spotify: [],
    soundcloud: [],
    youtube: [],
    mixcloud: []
  }
};

export default function libraryReducer(state = initialState, action) {
  switch (action.type) {
    case IMPORT_LIKES: {
      let likes = action.payload; // typeof Playlist
      const source = action.source;
      const playlistsOfThisSource = state.playlists[source].slice() || [];

      const hasLikesPlaylist = playlistsOfThisSource.some(
        (playlist) => playlist.id === "likes"
      );

      const updatedPlaylists = !hasLikesPlaylist
        ? [likes, ...playlistsOfThisSource]
        : playlistsOfThisSource.map((playlist) => {
            if (playlist.id === "likes") {
              return {
                ...playlist,
                ...likes,
                isConnected: playlist.isConnected,
                tracks: [...playlist.tracks, ...likes.tracks]
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

    case IMPORT_PLAYLISTS: {
      let newPlaylists = action.payload || [];
      const source = action.source;
      const replaceExisting = action.replaceExisting;

      if (replaceExisting) {
        return {
          ...state,
          playlists: {
            ...state.playlists,
            [source]: newPlaylists
          }
        };
      }

      // Map playlists by id
      const newPlaylistsMap = mapListByIdAndIndex(newPlaylists);

      // Delete playlists that are not in the new list
      let prevPlaylists = state.playlists[source].filter(
        (prevPlaylist) => newPlaylistsMap[prevPlaylist.id]
      );

      // Merge new and old playlists
      const newAndOldCombined = prevPlaylists.map((prevPlaylist) => {
        const newPlaylist = newPlaylistsMap[prevPlaylist.id];
        const newIndex = newPlaylist ? newPlaylist.index : null;
        const playlistExistedBefore = newIndex !== null;

        if (playlistExistedBefore) {
          const mergedOldAndNewPlaylist = {
            ...newPlaylist,
            total: newPlaylist.total,
            title: newPlaylist.title,
            img: newPlaylist.img,
            isStarred: prevPlaylist.isStarred,
            isConnected: prevPlaylist.isConnected
          };

          delete newPlaylistsMap[prevPlaylist.id];

          return mergedOldAndNewPlaylist;
        }

        return prevPlaylist;
      });

      // Add new playlists that were not in prevPlaylists
      const hasNewPlaylistsToImport = !isEmptyObject(newPlaylistsMap);
      if (hasNewPlaylistsToImport) {
        newAndOldCombined.push(...Object.values(newPlaylistsMap));
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

      const newPlaylistList = state.playlists[source].map((playlist) => {
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

    case REMOVE_PLAYLISTS: {
      const source = action.payload;

      return {
        ...state,
        playlists: {
          ...state.playlists,
          [source]: []
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
          [source]: state.playlists[source].map((playlist) => {
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
          [source]: state.playlists[source].map((playlist) => {
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

      const newPlaylistList = state.playlists[source].map((playlist) => {
        if (playlist.id.toString() === playlistId.toString()) {
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

    case SET_PLAYLIST_SETTINGS: {
      const source = action.source;
      const prevSettings = state.playlists[source];
      const prevSettingsMap = mapListByIdAndIndex(prevSettings);

      const newSettings = action.payload.map((updated) => ({
        ...prevSettingsMap[updated.id],
        ...updated
      }));

      return {
        ...state,
        playlists: {
          ...state.playlists,
          [source]: newSettings
        }
      };
    }

    case CLEAR_PLAYLIST_TRACKS: {
      const source = action.source;
      const playlistId = action.payload;

      const updatedPlaylists = state.playlists[source].map((playlist) => {
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

      const updatedPlaylists = state.playlists[source].map((playlist) => {
        // eslint-disable-next-line
        if (playlist.id == playlistId) {
          playlist.tracks = playlist.tracks.map((track) => {
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

    case TOGGLE_STAR_PLAYLIST: {
      const { source, payload: playlistId } = action;

      const playlistIndex = state.playlists[source].findIndex(
        (playlist) => playlist.id === playlistId
      );
      const playlistIsStarred =
        state.playlists[source][playlistIndex].isStarred;

      let lastStarIndex = state.playlists[source].findIndex(
        (playlist) => !playlist.isStarred
      );

      // If unstarring playlist
      if (playlistIsStarred) {
        // Decrement counter to accomodate reducing # of starred playlists
        lastStarIndex--;
      }

      const reorderedPlaylists = reorder(
        state.playlists[source],
        playlistIndex,
        lastStarIndex
      );

      return {
        ...state,
        playlists: {
          ...state.playlists,
          [source]: reorderedPlaylists.map((playlist) => {
            if (playlist.id === playlistId) {
              // Apply star or unstar
              playlist = {
                ...playlist,
                isStarred: !playlist.isStarred
              };
            }

            return playlist;
          })
        }
      };
    }

    default:
      return state;
  }
}
