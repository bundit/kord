import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";
import React from "react";

import styles from "../styles/library.module.css";

function LargePlayPauseButton({ isCurrentlyPlaying, handlePlay, handlePause }) {
  return !isCurrentlyPlaying ? (
    <button
      type="button"
      onClick={handlePlay}
      className={`${styles.playlistPlayButton} ${styles.largePlayPauseButton}`}
    >
      <FontAwesomeIcon icon={faPlay} />
    </button>
  ) : (
    <button
      type="button"
      onClick={handlePause}
      className={`${styles.playlistPlayButton} ${styles.largePlayPauseButton}`}
    >
      <FontAwesomeIcon icon={faPause} />
    </button>
  );
}

export default LargePlayPauseButton;
