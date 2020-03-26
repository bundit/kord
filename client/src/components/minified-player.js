import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleUp,
  faPlay,
  faPlayCircle,
  faPauseCircle
} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import React from "react";

import { ReactComponent as PlayIcon } from "../assets/play-button.svg";
import { ReactComponent as BackwardIcon } from "../assets/backward.svg";
import { ReactComponent as ForwardIcon } from "../assets/forward.svg";

import styles from "../styles/player.module.css";
import truncateString from "../utils/truncateString";
import placeholderImg from "../assets/placeholder.png";

const MinifiedPlayer = ({
  current: {
    title,
    artist: { name: artistName },
    img
  },
  handleToggleExpand,
  handlePlayPause,
  isPlaying
}) => (
  <div
    className={`${styles.playerWrapper} ${styles.miniPlayer}`}
    tabIndex="0"
    onKeyPress={handleToggleExpand}
    role="button"
    onClick={handleToggleExpand}
  >
    <button
      type="button"
      onClick={handleToggleExpand}
      className={styles.miniPlayerExpandButton}
    >
      <FontAwesomeIcon icon={faAngleUp} />
    </button>
    <div className={styles.miniPlayerImageWrap}>
      <img
        src={img ? img.replace("large.jpg", "t500x500.jpg") : placeholderImg}
        alt="album-art"
      />
    </div>
    <div className={styles.titleWrapper}>
      <div>
        <strong>{truncateString(title, 38)}</strong>
      </div>
      <div>{truncateString(artistName, 38)}</div>
    </div>
    <button
      type="button"
      onClick={handlePlayPause}
      className={styles.miniPlayerPlayButton}
    >
      <FontAwesomeIcon icon={isPlaying ? faPauseCircle : faPlay} />
    </button>
    <div className={styles.desktopButtonGroup}>
      <button type="button" className={styles.backwardButton}>
        <BackwardIcon />
      </button>
      <button type="button" className={styles.desktopPlayButton}>
        <PlayIcon />
      </button>
      <button type="button" className={styles.forwardButton}>
        <ForwardIcon />
      </button>
    </div>

    <div>
      <input type="range" className={styles.slider} />
    </div>
  </div>
);

MinifiedPlayer.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  current: PropTypes.object.isRequired,
  handleToggleExpand: PropTypes.func.isRequired,
  handlePlayPause: PropTypes.func.isRequired,
  isPlaying: PropTypes.bool.isRequired
};

export default MinifiedPlayer;
