import React from "react";

import { PlayPauseButton } from "./buttons";

import styles from "../styles/active-image-overlay.module.scss";

function ActiveImageOverlay({ isPlaying, isActive, handlePlayTrack }) {
  return (
    <div className={styles.overlay} style={{ opacity: isActive ? 1 : null }}>
      {isPlaying && isActive ? (
        <>
          <div className={`${styles.bar} ${!isPlaying && styles.paused}`} />
          <div
            className={`${styles.bar} ${styles.midBar} ${!isPlaying &&
              styles.paused}`}
          />
          <div className={`${styles.bar} ${!isPlaying && styles.paused}`} />
        </>
      ) : (
        <PlayPauseButton
          onClick={handlePlayTrack}
          size="lg"
          isPlaying={isPlaying && isActive}
        />
      )}
    </div>
  );
}

export default ActiveImageOverlay;
