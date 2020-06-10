import {
  ADD_TO_QUEUE,
  NEXT_TRACK,
  PAUSE,
  PLAY,
  PREV_TRACK,
  SEEK,
  SET_DURATION,
  SET_QUEUE,
  SET_SEEK,
  SET_TRACK
} from "./types";
import { fetchGeneric } from "../../utils/fetchGeneric";
import { loadPlaylistTracks } from "./libraryActions";
import { mapCollectionToTracks } from "./soundcloudActions";
import { mapJsonToTracks, spotifyApi } from "./spotifyActions";
import store from "../store";

export const playTrack = (index, tracklist, nextHref, context) => dispatch => {
  while (index < tracklist.length && !tracklist[index].streamable) {
    index++;
  }
  const currentTrack = tracklist[index];

  dispatch(setTrack(currentTrack));
  dispatch(setQueueIndex(index));
  dispatch(setQueue(tracklist));
  dispatch(setNextQueueHref(nextHref));
  dispatch(setContext(context));
};

export function play() {
  let silentPlayer = document.getElementById("player");
  if (silentPlayer) {
    silentPlayer.play();
  }
  navigator.mediaSession.playbackState = "playing";

  return {
    type: PLAY
  };
}

export function pause() {
  let silentPlayer = document.getElementById("player");
  if (silentPlayer) {
    silentPlayer.pause();
  }
  navigator.mediaSession.playbackState = "paused";

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

function next() {
  return {
    type: NEXT_TRACK
  };
}

export const nextTrack = () => dispatch => {
  let state = store.getState();
  let index = state.player.index;
  const queue = state.player.queue;

  do {
    index++;
  } while (index < queue.length && !queue[index].streamable);

  if (index >= queue.length) {
    return dispatch(loadMoreQueueTracks()).then(() => dispatch(next()));
  }

  return dispatch(next());
};

export function prevTrack() {
  return {
    type: PREV_TRACK
  };
}

export function addToQueue(track) {
  return {
    type: ADD_TO_QUEUE,
    payload: track
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
    type: "SET_QUEUE_INDEX",
    payload: i
  };
}

export function setVolume(newVolume) {
  return {
    type: "SET_VOLUME",
    payload: newVolume
  };
}

export function setMuted(isMuted) {
  return {
    type: "SET_MUTED",
    payload: isMuted
  };
}

function setNextQueueHref(nextHref) {
  return {
    type: "SET_NEXT_QUEUE_HREF",
    payload: nextHref
  };
}

function setContext(context) {
  return {
    type: "SET_CONTEXT",
    payload: context
  };
}

export const playPlaylist = playlist => dispatch => {
  const { source, id, next, tracks, total } = playlist;
  const context = {
    source: source,
    id: id
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
    type: "APPEND_QUEUE",
    payload: Array.isArray(tracks) ? tracks : [tracks]
  };
}

const loadMoreQueueTracks = () => dispatch => {
  const playerState = store.getState().player;
  let {
    nextHref,
    context: { source }
  } = playerState;

  if (!nextHref) {
    return Promise.resolve("No more results");
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
  }

  return promise.then(({ tracks, next }) => {
    dispatch(appendQueue(tracks));
    dispatch(setNextQueueHref(next));
  });
};
