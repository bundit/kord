import { CSSTransition } from "react-transition-group";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { forceCheck } from "react-lazyload";
import { useDispatch, useSelector } from "react-redux";
import React from "react";

import {
  play,
  playFromQueue,
  removeTrackFromQueue
} from "../redux/actions/playerActions";
import { toggleUserQueue } from "../redux/actions/userActions";
import TrackItem from "./track-item";
import TrackList from "./track-list";
import modalStyles from "../styles/modal.module.css";
import slideTransition from "../styles/slideModal.module.css";
import styles from "../styles/library.module.css";

const UserQueue = () => {
  const dispatch = useDispatch();

  const isPlaying = useSelector(state => state.player.isPlaying);
  const isUserQueueOpen = useSelector(
    state => state.user.settings.isUserQueueOpen
  );
  const {
    currentTrack,
    index,
    queue,
    userQueueIndex,
    userQueue,
    relatedTracksIndex,
    relatedTracks,
    context
  } = useSelector(state => state.player);
  const nextInUserQueue = userQueue
    ? userQueue.slice(userQueueIndex, userQueue.length)
    : [];
  const nextInPlayerQueue = queue.slice(index + 1);
  const nextInRelatedTracks = relatedTracks
    ? relatedTracks.slice(relatedTracksIndex)
    : [];

  function handleToggleShowQueue() {
    dispatch(toggleUserQueue());
  }

  function handlePlayCurrent() {
    dispatch(play());
  }

  function handlePlayFromUserAddedQueue(offset) {
    dispatch(playFromQueue(offset, "userQueue"));
  }

  function handlePlayFromQueue(offset) {
    dispatch(playFromQueue(offset, "queue"));
  }

  function handlePlayFromRelated(offset) {
    dispatch(playFromQueue(offset, "relatedTracks"));
  }

  function handleRemoveTrackFromUserQueue(offset) {
    dispatch(removeTrackFromQueue(offset, "userQueue"));
  }

  function handleRemoveTrackFromQueue(offset) {
    dispatch(removeTrackFromQueue(offset, "queue"));
  }

  function handleRemoveFromRelated(offset) {
    dispatch(removeTrackFromQueue(offset, "relatedTracks"));
  }

  const queueList = [
    {
      list: nextInUserQueue,
      id: "userQueue",
      title: "Next in your Queue",
      handlePlay: handlePlayFromUserAddedQueue,
      handleRemove: handleRemoveTrackFromUserQueue
    },
    {
      list: nextInPlayerQueue,
      id: "queue",
      title: `Next from ${context.title}`,
      handlePlay: handlePlayFromQueue,
      handleRemove: handleRemoveTrackFromQueue
    },
    {
      list: nextInRelatedTracks,
      id: "relatedTracks",
      title: "Next Suggested",
      handlePlay: handlePlayFromRelated,
      handleRemove: handleRemoveFromRelated
    }
  ];

  const queueComponents = queueList
    .filter(queue => queue.list && queue.list.length)
    .map(queue => (
      <React.Fragment key={queue.id}>
        <span className={`${modalStyles.formTitle} ${styles.queueTitle}`}>
          {queue.title}
        </span>
        <TrackList
          tracks={queue.list}
          isPlaying={isPlaying}
          currentTrackID={currentTrack.id}
          handlePlay={queue.handlePlay}
          handleRemoveTrack={queue.handleRemove}
          isFromQueue
        />
      </React.Fragment>
    ));

  return (
    <CSSTransition
      in={isUserQueueOpen}
      timeout={350}
      classNames={slideTransition}
      unmountOnExit
    >
      <div className={styles.queueWrapper}>
        <div className={modalStyles.modalHeader}>
          <span className={modalStyles.modalTitle} style={{ color: "#ccc" }}>
            Your Queue
          </span>
          <button
            className={modalStyles.closeButton}
            onClick={handleToggleShowQueue}
            type="button"
          >
            <FontAwesomeIcon icon={faTimes} size="2x" />
          </button>
        </div>
        <div
          className={modalStyles.formInnerWrapper}
          onScroll={forceCheck}
          style={{ maxHeight: "515px" }}
        >
          <span className={`${modalStyles.formTitle} ${styles.queueTitle}`}>
            Currently Playing
          </span>
          <TrackItem
            track={currentTrack}
            isActive={true}
            isPlaying={isPlaying}
            handlePlay={handlePlayCurrent}
            isFromQueue
          />
          {queueComponents}
        </div>
      </div>
    </CSSTransition>
  );
};

export default UserQueue;
