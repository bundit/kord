import {
  ADD_TO_QUEUE,
  APPEND_QUEUE,
  NEXT_TRACK,
  PAUSE,
  PLAY,
  PREV_TRACK,
  SEEK,
  SET_CONTEXT,
  SET_DURATION,
  SET_MUTED,
  SET_NEXT_QUEUE_HREF,
  SET_PLAYER,
  SET_QUEUE,
  SET_QUEUE_INDEX,
  SET_SEEK,
  SET_TRACK,
  SET_VOLUME
} from "../actions/types";

const initialState = {
  currentTrack: {
    title: "Nothing",
    artist: {
      name: "Currently Playing"
    },
    id: "-1"
  },
  isMuted: false,
  duration: 0,
  seek: 0,
  isPlaying: false,
  volume: 1.0,
  index: 0,
  queue: [],
  context: {
    source: "source",
    id: "id"
  },
  nextHref: null
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
      let newPos = state.seek + action.payload;
      newPos = newPos < 0 ? 0 : newPos;
      newPos = newPos > state.trackLength ? state.trackLength : newPos;

      return {
        ...state,
        seek: newPos
      };
    }

    case SET_PLAYER: {
      return {
        ...state,
        player: action.payload
      };
    }

    case SET_TRACK: {
      return {
        ...state,
        isPlaying: true,
        currentTrack: action.payload,
        isLoaded: false
      };
    }

    case SET_DURATION: {
      return {
        ...state,
        duration: action.payload
      };
    }

    case SET_SEEK: {
      return {
        ...state,
        seek: action.payload
      };
    }

    case NEXT_TRACK: {
      let nextIndex = state.index;
      const queue = state.queue;

      do {
        nextIndex++;
      } while (nextIndex < queue.length && !queue[nextIndex].streamable);

      const nextTrack = state.queue[nextIndex];

      if (nextIndex >= queue.length) {
        return {
          ...initialState,
          isPlaying: false,
          volume: state.volume
        };
      }

      return {
        ...state,
        currentTrack: nextTrack,
        duration: nextTrack.duration,
        index: nextIndex
      };
    }

    case PREV_TRACK: {
      let prevIndex = state.index;
      const queue = state.queue;

      do {
        prevIndex--;
      } while (prevIndex > 0 && !queue[prevIndex].streamable);

      if (prevIndex < 0) prevIndex = 0;

      const prevTrack = state.queue[prevIndex];

      return {
        ...state,
        currentTrack: prevTrack,
        duration: prevTrack.duration,
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

    case SET_QUEUE_INDEX: {
      return {
        ...state,
        index: action.payload
      };
    }

    case SET_VOLUME: {
      return {
        ...state,
        volume: action.payload
      };
    }

    case SET_NEXT_QUEUE_HREF: {
      return {
        ...state,
        nextHref: action.payload
      };
    }

    case SET_CONTEXT: {
      return {
        ...state,
        context: action.payload
      };
    }

    case APPEND_QUEUE: {
      return {
        ...state,
        queue: [...state.queue, ...action.payload]
      };
    }

    case SET_MUTED: {
      return {
        ...state,
        isMuted: action.payload
      };
    }

    default:
      return state;
  }
}
