import {
  PLAY,
  PAUSE,
  SEEK,
  SET_TRACK,
  NEXT_TRACK,
  PREV_TRACK,
  ADD_TO_QUEUE,
  REMOVE_FROM_QUEUE,
  PLAY_FROM_QUEUE,
  SET_QUEUE
} from "../actions/types";

const initialState = {
  currentTrack: null,
  position: 0,
  trackLength: 0,
  isPlaying: false,
  index: 0,
  queue: [],
  scPlayer: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case PLAY: {
      return {
        ...state,
        isPlaying: true
      };
    }
    case PAUSE: {
      return {
        ...state,
        isPlaying: false
      };
    }
    case SEEK: {
      let newPos = state.position + action.payload;
      newPos = newPos < 0 ? 0 : newPos;
      newPos = newPos > state.trackLength ? state.trackLength : newPos;

      return {
        ...state,
        position: newPos
      };
    }
    case SET_TRACK: {
      return {
        ...state,
        isPlaying: true,
        currentTrack: action.payload
      };
    }
    case NEXT_TRACK: {
      const nextIndex = state.index + 1;
      const nextTrack = state.queue[nextIndex];
      const queueLength = state.queue.length;

      if (nextIndex >= queueLength) return initialState;

      return {
        ...state,
        currentTrack: nextTrack,
        position: 0,
        trackLength: nextTrack.duration,
        index: nextIndex
      };
    }
    case PREV_TRACK: {
      const prevIndex = state.index - 1;
      const prevTrack = state.queue[prevIndex];

      if (prevIndex < 0) return state;

      return {
        ...state,
        currentTrack: prevTrack,
        position: 0,
        trackLength: prevTrack.duration,
        index: prevIndex
      };
    }
    case ADD_TO_QUEUE: {
      const newQ = state.queue;
      newQ.push(action.payload);

      return {
        ...state,
        queue: newQ
      };
    }
    case SET_QUEUE: {
      return {
        ...state,
        queue: action.payload
      };
    }
    default:
      return state;
  }
}
