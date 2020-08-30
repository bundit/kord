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
} from "./types";
import {
  addToSpotifyPlaylist,
  fetchSpotifyLikes,
  fetchSpotifyPlaylistTracks,
  fetchSpotifyPlaylists,
  removeFromSpotifyPlaylist
} from "./spotifyActions";
import {
  fetchSoundcloudLikes,
  fetchSoundcloudPlaylistTracks,
  fetchSoundcloudPlaylists
} from "./soundcloudActions";
import {
  fetchYoutubePlaylistTracks,
  fetchYoutubePlaylists
} from "./youtubeActions";
import store from "../store";

export function importLikes(source, likes) {
  return {
    type: IMPORT_LIKES,
    source,
    payload: likes
  };
}

export function importPlaylists(source, playlists) {
  return {
    type: IMPORT_PLAYLISTS,
    source,
    payload: playlists
  };
}

export function importPlaylistTracks(source, playlistId, tracks) {
  return {
    type: IMPORT_PLAYLIST_TRACKS,
    source,
    playlistId,
    payload: tracks
  };
}

export function setNextPlaylistHref(source, playlistId, nextHref) {
  return {
    type: SET_NEXT_PLAYLIST_HREF,
    source,
    playlistId,
    payload: nextHref
  };
}

export function movePlaylistsToTrash(source) {
  return {
    type: MOVE_PLAYLISTS_TO_TRASH,
    payload: source
  };
}

export function restorePlaylistsFromTrash(source) {
  return {
    type: RESTORE_PLAYLISTS_FROM_TRASH,
    payload: source
  };
}

export function clearTrash(source) {
  return {
    type: CLEAR_TRASH,
    payload: source
  };
}

export const setPlaylistConnections = (source, newSettings) => {
  return {
    type: SET_PLAYLIST_CONNECTIONS,
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
    type: CLEAR_PLAYLIST_TRACKS,
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

export const addTrackToPlaylists = (playlistIds, track) => dispatch => {
  const addTrack = {
    spotify: addToSpotifyPlaylist
  };

  let requests = [];

  requests = playlistIds.map(playlistId => {
    if (addTrack[track.source]) {
      return dispatch(addTrack[track.source](playlistId, track)).then(() =>
        dispatch(addTrackToPlaylistAction(playlistId, track))
      );
    }

    return Promise.reject(new Error("Unable to add track"));
  });

  return Promise.all(requests);
};

export const removeFromPlaylist = track => dispatch => {
  const removeTrack = {
    spotify: removeFromSpotifyPlaylist
  };

  if (removeTrack[track.source]) {
    return dispatch(removeTrack[track.source](track)).then(() =>
      dispatch(removeFromPlaylistAction(track))
    );
  }

  return Promise.reject(new Error("Remove track failed"));
};

function addTrackToPlaylistAction(playlistId, track) {
  return {
    type: ADD_TRACK_TO_PLAYLIST,
    playlistId,
    payload: track
  };
}

function removeFromPlaylistAction(track) {
  return {
    type: REMOVE_TRACK_FROM_PLAYLIST,
    playlistId: track.playlistId,
    index: track.index,
    payload: track
  };
}
