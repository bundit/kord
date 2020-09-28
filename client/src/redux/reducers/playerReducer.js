import {
  ADD_TRACK_TO_USER_QUEUE,
  APPEND_QUEUE,
  NEXT_TRACK,
  PAUSE,
  PLAY,
  PLAY_FROM_QUEUE,
  PLAY_FROM_USER_QUEUE,
  PREV_TRACK,
  REMOVE_TRACK_FROM_QUEUE,
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
  SET_TRACK_UNSTREAMABLE,
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
  volume: 0.5,
  index: 0,
  queue: [],
  userQueueIndex: 0,
  userQueue: [],
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
      let nextUserQueueIndex = state.userQueueIndex;
      const queue = state.queue;
      const userQueue = state.userQueue || [];

      // If there is a user queued song
      if (nextUserQueueIndex < userQueue.length) {
        const nextTrackInUserQueue = userQueue[nextUserQueueIndex];
        return {
          ...state,
          currentTrack: nextTrackInUserQueue,
          userQueueIndex: nextUserQueueIndex + 1,
          duration: nextTrackInUserQueue.duration
        };
      }

      // Else play from list queue
      do {
        nextIndex++;
      } while (nextIndex < queue.length && !queue[nextIndex].streamable);

      // No more songs in list queue and user queue
      if (nextIndex >= queue.length) {
        return {
          ...initialState,
          isPlaying: false,
          volume: state.volume,
          isMuted: state.isMuted
        };
      } else {
        const nextTrackInListQueue = state.queue[nextIndex];

        return {
          ...state,
          currentTrack: nextTrackInListQueue,
          duration: nextTrackInListQueue.duration,
          index: nextIndex,
          userQueue: [],
          userQueueIndex: 0
        };
      }
    }

    case PREV_TRACK: {
      let prevIndex = state.index;
      const queue = state.queue;

      if (prevIndex === 0) {
        return state;
      }

      do {
        prevIndex--;
      } while (prevIndex > 0 && !queue[prevIndex].streamable);

      if (prevIndex < 0) prevIndex = 0;

      const prevTrack = state.queue[prevIndex];

      return {
        ...state,
        currentTrack: prevTrack,
        index: prevIndex
      };
    }

    case ADD_TRACK_TO_USER_QUEUE: {
      return {
        ...state,
        userQueue: [...(state.userQueue || []), action.payload]
      };
    }

    case REMOVE_TRACK_FROM_QUEUE: {
      const { offset, whichQueue } = action.payload;
      const { index, userQueueIndex } = state;

      if (whichQueue === "userQueue") {
        const newUserQueue = state.userQueue.slice();
        newUserQueue.splice(userQueueIndex + offset, 1);

        return {
          ...state,
          userQueue: newUserQueue
        };
      }

      // else normal queue
      const newQueue = state.queue.slice();
      newQueue.splice(index + offset + 1, 1);

      return {
        ...state,
        queue: newQueue
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

    case SET_TRACK_UNSTREAMABLE: {
      const trackId = action.payload;
      return {
        ...state,
        queue: state.queue.map(track => {
          // eslint-disable-next-line
          if (track.id == trackId) {
            track.streamable = false;
          }
          return track;
        })
      };
    }

    case PLAY_FROM_QUEUE: {
      const offset = action.payload;
      const index = state.index;
      return {
        ...state,
        currentTrack: state.queue[index + offset + 1],
        index: index + offset + 1,
        isPlaying: true
      };
    }

    case PLAY_FROM_USER_QUEUE: {
      const offset = action.payload;
      const userQueueIndex = state.userQueueIndex;

      return {
        ...state,
        currentTrack: state.userQueue[userQueueIndex + offset],
        userQueueIndex: userQueueIndex + offset + 1,
        isPlaying: true
      };
    }

    default:
      return state;
  }
}
