import {
  PLAY,
  PAUSE,
  SEEK,
  NEXT,
  PREV,
  ADD_TO_QUEUE,
  REMOVE_FROM_QUEUE,
  PLAY_FROM_QUEUE,
  SET_QUEUE
} from "../actions/types";

const initialState = {
  currentTrack: null,
  queue: [],
  scPlayer: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
