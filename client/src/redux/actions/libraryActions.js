import { SET_TRACK_UNSTREAMABLE } from "./types";
import {
  fetchSoundcloudLikes,
  fetchSoundcloudPlaylistTracks,
  fetchSoundcloudPlaylists
} from "./soundcloudActions";
import {
  fetchSpotifyLikes,
  fetchSpotifyPlaylistTracks,
  fetchSpotifyPlaylists
} from "./spotifyActions";
import {
  fetchYoutubePlaylistTracks,
  fetchYoutubePlaylists
} from "./youtubeActions";
import store from "../store";

export function importSongs(songs) {
  return {
    type: "IMPORT_SONGS",
    payload: songs
  };
}

export function importSong(song) {
  return {
    type: "IMPORT_SONG",
    payload: song
  };
}

export function importLikes(source, likes) {
  return {
    type: "IMPORT_LIKES",
    source,
    payload: likes
  };
}

export function importPlaylists(source, playlists) {
  return {
    type: "IMPORT_PLAYLISTS",
    source,
    payload: playlists
  };
}

export function importPlaylistTracks(source, playlistId, tracks) {
  return {
    type: "IMPORT_PLAYLIST_TRACKS",
    source,
    playlistId,
    payload: tracks
  };
}

export function setNextPlaylistHref(source, playlistId, nextHref) {
  return {
    type: "SET_NEXT_PLAYLIST_HREF",
    source,
    playlistId,
    payload: nextHref
  };
}

export function movePlaylistsToTrash(source) {
  return {
    type: "MOVE_PLAYLISTS_TO_TRASH",
    payload: source
  };
}

export function restorePlaylistsFromTrash(source) {
  return {
    type: "RESTORE_PLAYLISTS_FROM_TRASH",
    payload: source
  };
}

export function clearTrash(source) {
  return {
    type: "CLEAR_TRASH",
    payload: source
  };
}

export const setPlaylistConnections = (source, newSettings) => {
  return {
    type: "SET_PLAYLIST_CONNECTIONS",
    source,
    payload: newSettings
  };
};

export const fetchPlaylists = (source, username) => dispatch => {
  if (source === "spotify") {
    return dispatch(fetchSpotifyPlaylists());
  } else if (source === "soundcloud") {
    return dispatch(fetchSoundcloudPlaylists(username));
  } else if (source === "youtube") {
    return dispatch(fetchYoutubePlaylists());
  }
};

export const loadLikes = source => dispatch => {
  if (source === "spotify") {
    return dispatch(fetchSpotifyLikes());
  } else if (source === "soundcloud") {
    const userId = store.getState().user.soundcloud.id;

    return dispatch(fetchSoundcloudLikes(null, userId));
  }
};

export const loadPlaylistTracks = (source, id, next) => dispatch => {
  if (!next) {
    return Promise.resolve();
  }

  if (source === "spotify") {
    return dispatch(fetchSpotifyPlaylistTracks(id, next));
  } else if (source === "soundcloud") {
    if (id === "likes") {
      return dispatch(fetchSoundcloudLikes(next));
    } else {
      return dispatch(fetchSoundcloudPlaylistTracks(id, next));
    }
  } else if (source === "youtube") {
    return dispatch(fetchYoutubePlaylistTracks(id, next));
  }
};

export function clearPlaylistTracks(source, playlistId) {
  return {
    type: "CLEAR_PLAYLIST_TRACKS",
    source,
    payload: playlistId
  };
}

export function setTrackUnstreamable(id) {
  const context = store.getState().player.context || {};
  return {
    type: SET_TRACK_UNSTREAMABLE,
    context,
    payload: id
  };
}
