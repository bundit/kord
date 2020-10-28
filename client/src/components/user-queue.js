import { CSSTransition } from "react-transition-group";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { forceCheck } from "react-lazyload";
import { useDispatch, useSelector } from "react-redux";
import React from "react";

import { ClearQueueButton, LargeIconButton as CloseButton } from "./buttons";
import {
  clearRestOfQueue,
  play,
  playFromQueue,
  removeTrackFromQueue
} from "../redux/actions/playerActions";
import { toggleUserQueue } from "../redux/actions/userActions";
import TrackItem from "./track-item";
import TrackList from "./track-list";
import formStyles from "../styles/form.module.scss";
import modalStyles from "../styles/modal.module.scss";
import slideTransition from "../styles/slideModal.module.css";
import styles from "../styles/user-queue.module.scss";

const UserQueue = () => {
  const dispatch = useDispatch();
  const currentTrack = useSelector(state => state.player.currentTrack);
  const index = useSelector(state => state.player.index);
  const queue = useSelector(state => state.player.queue);
  const userQueueIndex = useSelector(state => state.player.userQueueIndex);
  const userQueue = useSelector(state => state.player.userQueue);
  const relatedTracksIndex = useSelector(
    state => state.player.relatedTracksIndex
  );
  const relatedTracks = useSelector(state => state.player.relatedTracks);
  const context = useSelector(state => state.player.context);

  const isPlaying = useSelector(state => state.player.isPlaying);
  const isUserQueueOpen = useSelector(
    state => state.user.settings.isUserQueueOpen
  );

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

  function handleClearRestOfUserQueue(offset) {
    dispatch(clearRestOfQueue("userQueue"));
  }

  function handleClearRestOfQueue(offset) {
    dispatch(clearRestOfQueue("queue"));
  }

  function handleClearRestOfRelated(offset) {
    dispatch(clearRestOfQueue("relatedTracks"));
  }

  const queueList = [
    {
      list: nextInUserQueue,
      id: "userQueue",
      title: "Next in your Queue",
      handlePlay: handlePlayFromUserAddedQueue,
      handleRemove: handleRemoveTrackFromUserQueue,
      handleClear: handleClearRestOfUserQueue
    },
    {
      list: nextInPlayerQueue,
      id: "queue",
      title: `Next from ${context.title}`,
      handlePlay: handlePlayFromQueue,
      handleRemove: handleRemoveTrackFromQueue,
      handleClear: handleClearRestOfQueue
    },
    {
      list: nextInRelatedTracks,
      id: "relatedTracks",
      title: "Next Suggested",
      handlePlay: handlePlayFromRelated,
      handleRemove: handleRemoveFromRelated,
      handleClear: handleClearRestOfRelated
    }
  ];

  const queueComponents = queueList
    .filter(queue => queue.list && queue.list.length)
    .map(queue => (
      <React.Fragment key={queue.id}>
        <div
          className={`${formStyles.formTitle} ${styles.queueTitle}`}
          style={{ display: "flex", alignItems: "center" }}
        >
          <span>{queue.title}</span>
          <ClearQueueButton
            onClick={queue.handleClear}
            style={{ marginRight: "7px" }}
          />
        </div>
        <TrackList
          tracks={queue.list}
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
          <CloseButton
            icon={faTimes}
            onClick={handleToggleShowQueue}
            style={{ marginLeft: "auto", fontSize: "12px" }}
          />
        </div>
        <div
          className={formStyles.formInnerWrapper}
          onScroll={forceCheck}
          style={{ height: "515px" }}
        >
          <span className={`${formStyles.formTitle} ${styles.queueTitle}`}>
            Currently Playing
          </span>
          <TrackItem
            track={currentTrack}
            isActive={true}
            isPlaying={isPlaying}
            handlePlay={handlePlayCurrent}
            index={0}
            isFromQueue
          />
          {queueComponents}
        </div>
      </div>
    </CSSTransition>
  );
};

export default UserQueue;
