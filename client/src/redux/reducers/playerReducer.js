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
  SET_PLAYER,
  SET_QUEUE,
  SET_QUEUE_INDEX,
  SET_RELATED_TRACKS,
  SET_SEEK,
  SET_SHOW_YOUTUBE_PLAYER,
  SET_TRACK,
  SET_TRACK_UNSTREAMABLE,
  SET_VOLUME,
  TOGGLE_EXPANDED_PLAYER,
  TOGGLE_REPEAT,
  TOGGLE_SHUFFLE
} from "../actions/types";
import { shuffleTracks, unshuffleTracks } from "../../utils/shuffle";

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
  relatedTracksIndex: 0,
  relatedTracks: [],
  context: {
    source: "source",
    id: "id"
  },
  nextHref: null,
  seekAmount: 15,
  isPlayerExpanded: false,
  allowAutoPlay: true,
  shuffleEnabled: false,
  repeatEnabled: false,
  showYoutubePlayer: false
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
        currentTrack: action.payload
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
      let { index, userQueueIndex, relatedTracksIndex } = state;
      let { queue, userQueue, relatedTracks } = state;

      userQueue = userQueue || [];
      relatedTracks = relatedTracks || [];

      // If there is a user queued song
      if (userQueueIndex < userQueue.length) {
        const nextTrackInUserQueue = userQueue[userQueueIndex];
        return {
          ...state,
          currentTrack: nextTrackInUserQueue,
          userQueueIndex: userQueueIndex + 1,
          duration: nextTrackInUserQueue.duration
        };
      }

      // Else play from list queue
      do {
        index++;
      } while (index < queue.length && !queue[index].streamable);

      if (index < queue.length) {
        const nextTrackInListQueue = queue[index];
        return {
          ...state,
          currentTrack: nextTrackInListQueue,
          duration: nextTrackInListQueue.duration,
          index: index,
          userQueue: [],
          userQueueIndex: 0
        };
      }

      // Else play from related tracks
      if (relatedTracksIndex < relatedTracks.length) {
        const nextTrackInRelated = relatedTracks[relatedTracksIndex];
        return {
          ...state,
          currentTrack: nextTrackInRelated,
          duration: nextTrackInRelated.duration,
          relatedTracksIndex: relatedTracksIndex + 1,
          queue: [],
          index: 0
        };
      }

      // No more tracks in all queues
      return {
        ...initialState,
        isPlaying: false,
        volume: state.volume,
        isMuted: state.isMuted
      };
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
      const { index, userQueueIndex, relatedTracksIndex } = state;

      if (whichQueue === "queue") {
        const newQueue = state.queue.slice();
        newQueue.splice(index + offset + 1, 1);

        return {
          ...state,
          queue: newQueue
        };
      } else if (whichQueue === "userQueue") {
        const newUserQueue = state.userQueue.slice();
        newUserQueue.splice(userQueueIndex + offset, 1);

        return {
          ...state,
          userQueue: newUserQueue
        };
      } else if (whichQueue === "relatedTracks") {
        const newRelatedTracks = state.relatedTracks.slice();
        newRelatedTracks.splice(relatedTracksIndex + offset, 1);

        return {
          ...state,
          relatedTracks: newRelatedTracks
        };
      }

      return state;
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
      const { offset, whichQueue } = action.payload;
      const { queue, userQueue, relatedTracks } = state;
      const { index, userQueueIndex, relatedTracksIndex } = state;

      // const index = state.index;
      if (whichQueue === "queue") {
        return {
          ...state,
          currentTrack: queue[index + offset + 1],
          index: index + offset + 1,
          isPlaying: true
        };
      } else if (whichQueue === "userQueue") {
        return {
          ...state,
          currentTrack: userQueue[userQueueIndex + offset],
          userQueueIndex: userQueueIndex + offset + 1,
          isPlaying: true
        };
      } else if (whichQueue === "relatedTracks") {
        return {
          ...state,
          currentTrack: relatedTracks[relatedTracksIndex + offset],
          relatedTracksIndex: relatedTracksIndex + offset + 1,
          isPlaying: true
        };
      }

      return state;
    }

    case SET_RELATED_TRACKS: {
      const relatedTracks = action.payload;

      return {
        ...state,
        relatedTracks: relatedTracks,
        relatedTracksIndex: 0
      };
    }

    case CLEAR_REST_OF_QUEUE: {
      const {
        index,
        queue,
        userQueueIndex,
        userQueue,
        relatedTracksIndex,
        relatedTracks
      } = state;
      const whichQueue = action.payload;

      if (whichQueue === "queue") {
        return {
          ...state,
          queue: queue.slice(0, index + 1),
          nextHref: null
        };
      } else if (whichQueue === "userQueue") {
        return {
          ...state,
          userQueue: userQueue.slice(0, userQueueIndex)
        };
      } else if (whichQueue === "relatedTracks") {
        return {
          ...state,
          relatedTracks: relatedTracks.slice(0, relatedTracksIndex)
        };
      }

      return state;
    }

    case TOGGLE_EXPANDED_PLAYER: {
      const isPlayerExpanded = state.isPlayerExpanded;

      return {
        ...state,
        isPlayerExpanded: !isPlayerExpanded
      };
    }

    case COLLAPSE_PLAYER: {
      return {
        ...state,
        isPlayerExpanded: false
      };
    }

    case SET_AUTOPLAY: {
      const allowAutoPlay = action.payload;

      return {
        ...state,
        allowAutoPlay
      };
    }

    case TOGGLE_SHUFFLE: {
      const shuffleEnabled = state.shuffleEnabled;
      const needToShuffle = !state.shuffleEnabled;
      const queue = state.queue;
      const currentIndex = state.index;

      if (!queue || !queue.length) {
        return {
          ...state,
          shuffleEnabled: !shuffleEnabled
        };
      }

      if (needToShuffle) {
        const shuffledTracks = shuffleTracks(queue, currentIndex);

        return {
          ...state,
          currentTrack: shuffledTracks[0],
          index: 0,
          queue: shuffledTracks,
          shuffleEnabled: !shuffleEnabled
        };
      }

      const sortedTracks = unshuffleTracks(queue);
      const originalTrackIndex = state.currentTrack.index;

      return {
        ...state,
        currentTrack: sortedTracks[originalTrackIndex],
        index: originalTrackIndex,
        queue: sortedTracks,
        shuffleEnabled: !shuffleEnabled
      };
    }

    case TOGGLE_REPEAT: {
      const repeatEnabled = state.repeatEnabled;

      return {
        ...state,
        repeatEnabled: !repeatEnabled
      };
    }

    case SET_SHOW_YOUTUBE_PLAYER: {
      const showYoutubePlayer = action.payload;

      return {
        ...state,
        showYoutubePlayer
      };
    }

    default:
      return state;
  }
}
