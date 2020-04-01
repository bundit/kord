import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleUp,
  faPlay,
  faPauseCircle
} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import React from "react";

import { ReactComponent as BackwardIcon } from "../assets/backward.svg";
import { ReactComponent as ForwardIcon } from "../assets/forward.svg";
import { ReactComponent as PauseIcon } from "../assets/pause-button.svg";
import { ReactComponent as PlayIcon } from "../assets/play-button.svg";
import { formatArtistName } from "../utils/formatArtistName";
import { useMobileDetection } from "../utils/useMobileDetection";
import placeholderImg from "../assets/placeholder.png";
import styles from "../styles/player.module.css";

const MinifiedPlayer = ({
  current: { title, artist, img },
  handleToggleExpand,
  handlePlayPause,
  isPlaying,
  handlePrev,
  handleNext
}) => {
  const isMobile = useMobileDetection();

  return (
    <div
      className={`${styles.playerWrapper} ${styles.miniPlayer}`}
      tabIndex={isMobile ? 0 : null}
      role="button"
      onClick={isMobile ? handleToggleExpand : null}
    >
      <button
        type="button"
        onClick={handleToggleExpand}
        className={styles.miniPlayerExpandButton}
      >
        <FontAwesomeIcon icon={faAngleUp} />
      </button>
      <div className={styles.nowPlaying}>
        <div className={styles.miniPlayerImageWrap}>
          <img
            src={
              img ? img.replace("large.jpg", "t500x500.jpg") : placeholderImg
            }
            alt="album-art"
          />
        </div>
        <div className={styles.titleWrapper}>
          <div className={styles.nowPlayingTitle}>{title}</div>
          <div className={styles.nowPlayingArtist}>
            {formatArtistName(artist)}
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={handlePlayPause}
        className={styles.miniPlayerPlayButton}
      >
        <FontAwesomeIcon icon={isPlaying ? faPauseCircle : faPlay} />
      </button>
      <div className={styles.desktopButtonGroup}>
        <button
          type="button"
          className={styles.backwardButton}
          onClick={handlePrev}
        >
          <BackwardIcon />
        </button>
        <button
          type="button"
          className={styles.desktopPlayPauseButton}
          onClick={handlePlayPause}
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
        <button
          type="button"
          className={styles.forwardButton}
          onClick={handleNext}
        >
          <ForwardIcon />
        </button>
      </div>

      <div className={styles.volumeSlider}>
        <input type="range" className={styles.slider} />
      </div>
    </div>
  );
};

MinifiedPlayer.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  current: PropTypes.object.isRequired,
  handleToggleExpand: PropTypes.func.isRequired,
  handlePlayPause: PropTypes.func.isRequired,
  isPlaying: PropTypes.bool.isRequired
};

export default MinifiedPlayer;
