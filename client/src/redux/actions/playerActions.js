import {
  ADD_TRACK_TO_USER_QUEUE,
  APPEND_QUEUE,
  CLEAR_REST_OF_QUEUE,
  COLLAPSE_PLAYER,
  NEXT_TRACK,
  PAUSE,
  PLAY,
  PLAY_FROM_QUEUE,
  PREV_TRACK,
  REMOVE_TRACK_FROM_QUEUE,
  SEEK,
  SET_AUTOPLAY,
  SET_CONTEXT,
  SET_DURATION,
  SET_MUTED,
  SET_NEXT_QUEUE_HREF,
  SET_QUEUE,
  SET_QUEUE_INDEX,
  SET_RELATED_TRACKS,
  SET_SEEK,
  SET_TRACK,
  SET_VOLUME,
  TOGGLE_EXPANDED_PLAYER
} from "./types";
import { capitalizeWord } from "../../utils/formattingHelpers";
import { fetchGeneric } from "../../utils/fetchGeneric";
import {
  fetchMoreYoutubeTrackResults,
  fetchRelatedYoutubeTracks,
  fetchYoutubePlaylistTracks
} from "./youtubeActions";
import {
  fetchRelatedSouncloudTracks,
  mapCollectionToTracks
} from "./soundcloudActions";
import {
  fetchRelatedSpotifyTracks,
  mapJsonToTracks,
  spotifyApi
} from "./spotifyActions";
import { loadPlaylistTracks } from "./libraryActions";
import store from "../store";

export const playTrack = (index, tracklist, nextHref, context) => dispatch => {
  while (index < tracklist.length && !tracklist[index].streamable) {
    index++;
  }
  const currentTrack = tracklist[index];

  dispatch(setTrack(currentTrack));
  dispatch(setQueueIndex(index));
  dispatch(setQueue(tracklist));
  dispatch(setRelatedTracks([]));
  dispatch(setNextQueueHref(nextHref));
  dispatch(setContext(context));
  dispatch(play());
};

export function play() {
  let silentPlayer = document.getElementById("player");
  if (silentPlayer) {
    silentPlayer.play();
  }

  if (navigator.mediaSession) {
    navigator.mediaSession.playbackState = "playing";
  }

  return {
    type: PLAY
  };
}

export function pause() {
  let silentPlayer = document.getElementById("player");
  if (silentPlayer) {
    silentPlayer.pause();
  }

  if (navigator.mediaSession) {
    navigator.mediaSession.playbackState = "paused";
  }

  return {
    type: PAUSE
  };
}

export function seek(seconds) {
  return {
    type: SEEK,
    payload: seconds
  };
}

export function setTrack(track) {
  return {
    type: SET_TRACK,
    payload: track
  };
}

export function setDuration(duration) {
  return {
    type: SET_DURATION,
    payload: duration
  };
}

export function setSeek(time) {
  return {
    type: SET_SEEK,
    payload: time
  };
}

function nextTrackAction() {
  return {
    type: NEXT_TRACK
  };
}

export const nextTrack = () => dispatch => {
  let state = store.getState();
  let { index, userQueueIndex, relatedTracksIndex } = state.player;
  const {
    queue,
    userQueue,
    currentTrack,
    relatedTracks,
    allowAutoPlay
  } = state.player;

  if (!allowAutoPlay) {
    return dispatch(nextTrackAction());
  }

  // Check if more tracks need to be loaded or not
  do {
    index++;
  } while (index < queue.length && !queue[index].streamable);

  while (
    userQueueIndex < userQueue.length &&
    !userQueue[userQueueIndex].streamable
  ) {
    userQueueIndex++;
  }

  while (
    relatedTracksIndex < relatedTracks.length &&
    !relatedTracks[relatedTracksIndex].streamable
  ) {
    relatedTracksIndex++;
  }

  const hasTracksLeftInAnyQueue =
    index < queue.length ||
    userQueueIndex < userQueue.length ||
    relatedTracksIndex < relatedTracks.length;

  if (!hasTracksLeftInAnyQueue) {
    return dispatch(loadMoreQueueTracks())
      .catch(() =>
        dispatch(fetchRelatedQueueTracks(currentTrack.source, currentTrack))
      )
      .then(() => dispatch(nextTrackAction()));
  }

  return dispatch(nextTrackAction());
};

export function prevTrack() {
  return {
    type: PREV_TRACK
  };
}

export function addTrackToUserQueue(track) {
  return {
    type: ADD_TRACK_TO_USER_QUEUE,
    payload: track
  };
}

export function removeTrackFromQueue(offset, whichQueue) {
  return {
    type: REMOVE_TRACK_FROM_QUEUE,
    payload: {
      offset,
      whichQueue
    }
  };
}

export function setQueue(newQ) {
  return {
    type: SET_QUEUE,
    payload: newQ
  };
}

export function setQueueIndex(i) {
  return {
    type: SET_QUEUE_INDEX,
    payload: i
  };
}

export function setVolume(newVolume) {
  return {
    type: SET_VOLUME,
    payload: newVolume
  };
}

export function setMuted(isMuted) {
  return {
    type: SET_MUTED,
    payload: isMuted
  };
}

function setNextQueueHref(nextHref) {
  return {
    type: SET_NEXT_QUEUE_HREF,
    payload: nextHref
  };
}

function setContext(context) {
  return {
    type: SET_CONTEXT,
    payload: context
  };
}

export function playFromQueue(offset, whichQueue) {
  return {
    type: PLAY_FROM_QUEUE,
    payload: {
      offset,
      whichQueue
    }
  };
}

function setRelatedTracks(relatedTracks) {
  return {
    type: SET_RELATED_TRACKS,
    payload: relatedTracks
  };
}

export function clearRestOfQueue(whichQueue) {
  return {
    type: CLEAR_REST_OF_QUEUE,
    payload: whichQueue
  };
}

export function toggleExpandedPlayer() {
  return {
    type: TOGGLE_EXPANDED_PLAYER
  };
}

export function collapsePlayer() {
  return {
    type: COLLAPSE_PLAYER
  };
}

export function setAutoPlay(allowAutoPlay) {
  return {
    type: SET_AUTOPLAY,
    payload: allowAutoPlay
  };
}

export const playPlaylist = playlist => dispatch => {
  const { source, id, next, tracks, total } = playlist;
  const context = {
    source: source,
    id: id,
    title: capitalizeWord(playlist.title)
  };

  if (total === 0) return;

  if (!tracks.length) {
    dispatch(loadPlaylistTracks(source, id, next)).then(({ tracks, next }) => {
      dispatch(playTrack(0, tracks, next, context));
    });
  } else {
    dispatch(playTrack(0, tracks, next, context));
  }
};

export function appendQueue(tracks) {
  return {
    type: APPEND_QUEUE,
    payload: Array.isArray(tracks) ? tracks : [tracks]
  };
}

const loadMoreQueueTracks = () => dispatch => {
  const state = store.getState();
  const playerState = state.player;

  let {
    nextHref,
    context: { source, id }
  } = playerState;

  if (!nextHref) {
    return Promise.reject("No more results");
  }

  let promise;
  let tracks;
  let next;

  if (source === "spotify") {
    promise = spotifyApi.getGeneric(nextHref).then(json => {
      tracks = json.tracks
        ? mapJsonToTracks(json.tracks, true)
        : mapJsonToTracks(json);
      next = json.tracks ? json.tracks.next : json.next;

      return { tracks, next };
    });
  } else if (source === "soundcloud") {
    if (nextHref.includes("api-v2")) {
      nextHref = `/api?url=${encodeURIComponent(
        `${nextHref}&client_id=${process.env.REACT_APP_SC_V2_KEY}`
      )}`;
    }

    promise = fetchGeneric(nextHref).then(data => {
      tracks = mapCollectionToTracks(data.collection);
      next = data.next_href;

      return { tracks, next };
    });
  } else if (source === "youtube") {
    if (id !== "search") {
      promise = dispatch(fetchYoutubePlaylistTracks(id, nextHref));
    } else if (id === "search") {
      promise = dispatch(fetchMoreYoutubeTrackResults(nextHref));
    }
  }

  return promise.then(({ tracks, next }) => {
    dispatch(appendQueue(tracks));
    dispatch(setNextQueueHref(next));
  });
};

const fetchRelatedQueueTracks = (source, track) => dispatch => {
  const fetchRelated = {
    soundcloud: fetchRelatedSouncloudTracks,
    spotify: fetchRelatedSpotifyTracks,
    youtube: fetchRelatedYoutubeTracks
  };

  if (fetchRelated[source]) {
    return dispatch(fetchRelated[source](track.id)).then(tracks =>
      dispatch(setRelatedTracks(tracks))
    );
  }
};
