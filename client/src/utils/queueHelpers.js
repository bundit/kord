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
