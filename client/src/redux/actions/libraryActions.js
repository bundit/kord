import * as Sentry from "@sentry/react";

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
} from "./types";
import {
  addToSpotifyPlaylist,
  fetchSpotifyLikes,
  fetchSpotifyPlaylistTracks,
  removeFromSpotifyPlaylist
} from "./spotifyActions";
import {
  addToYoutubePlaylist,
  fetchYoutubePlaylistTracks,
  removeFromYoutubePlaylist
} from "./youtubeActions";
import { fetchGeneric } from "../../utils/fetchGeneric";
import {
  fetchSoundcloudLikes,
  fetchSoundcloudPlaylistTracks
} from "./soundcloudActions";
import { setConnection } from "./userActions";
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

export function removePlaylists(source) {
  return {
    type: REMOVE_PLAYLISTS,
    payload: source
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

export const setPlaylistSettingsAction = (source, newSettings) => {
  return {
    type: SET_PLAYLIST_SETTINGS,
    source,
    payload: newSettings
  };
};

export const loadLikes = source => dispatch => {
  if (source === "spotify") {
    const setResults = true;
    return dispatch(fetchSpotifyLikes(setResults));
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

export function toggleStarPlaylist(playlistId, source) {
  return {
    type: TOGGLE_STAR_PLAYLIST,
    source,
    payload: playlistId
  };
}

export const addTrackToPlaylists = (playlistIds, track) => dispatch => {
  const addTrack = {
    spotify: addToSpotifyPlaylist,
    youtube: addToYoutubePlaylist
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
    spotify: removeFromSpotifyPlaylist,
    youtube: removeFromYoutubePlaylist
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

export const fetchUserPlaylists = exclude => dispatch => {
  return fetchGeneric(`/user/playlists?exclude=${exclude}`).then(playlists => {
    playlists = playlists.map(playlist => {
      try {
        playlist.img = JSON.parse(playlist.img);
      } catch (e) {
        playlist.img = null;
        Sentry.captureMessage(`Error parsing json ${playlist.img}`);
      }

      return {
        ...playlist,
        id: playlist.external_id,
        img: playlist.img,
        tracks: [],
        next: "start"
      };
    });

    // Get unique sources returned
    const sources = playlists.reduce(
      (unique, { source }) =>
        unique.includes(source) ? unique : [...unique, source],
      []
    );

    for (let source of sources) {
      const filteredPlaylists = playlists.filter(
        playlist => playlist.source === source
      );

      if (filteredPlaylists.length) {
        dispatch(importPlaylists(source, filteredPlaylists));
        dispatch(setConnection(source, true));
      }
    }
  });
};
