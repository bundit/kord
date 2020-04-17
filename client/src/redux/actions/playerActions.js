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

export function play() {
  return {
    type: PLAY
  };
}

export function pause() {
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

export function nextTrack() {
  return {
    type: NEXT_TRACK
  };
}

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
