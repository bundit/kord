export function hasTracksLeftInAnyQueue(playerState) {
  const {
    index,
    userQueueIndex,
    relatedTracksIndex,
    queue,
    userQueue,
    relatedTracks
  } = playerState;
  const isMainQueue = true;

  return (
    hasTracksLeft(index, queue, isMainQueue) ||
    hasTracksLeft(userQueueIndex, userQueue) ||
    hasTracksLeft(relatedTracksIndex, relatedTracks)
  );
}

function hasTracksLeft(index, queue, isMainQueue = false) {
  if (isMainQueue) {
    do {
      index++;
    } while (index < queue.length && !queue[index].streamable);
  } else {
    while (index < queue.length && !queue[index].streamable) {
      index++;
    }
  }

  return index < queue.length;
}

// Fisher–Yates shuffle algorithm:
// https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
// https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#The_modern_algorithm
/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Place the current tracks to the front of the list and shuffle the rest
export function shuffleTracks(tracks, currentIndex) {
  // Prevent direct modification of original array
  const sortedTracks = tracks.slice();

  if (currentIndex === undefined) {
    return shuffle(sortedTracks);
  }

  const [currentTrack] = sortedTracks.splice(currentIndex, 1);

  return [currentTrack, ...shuffle(sortedTracks)];
}

// Sort by original index
export function unshuffleTracks(tracks) {
  // Prevent direct modification of original array
  const unsortedTracks = tracks.slice();

  return unsortedTracks.sort((track1, track2) => track1.index - track2.index);
}
