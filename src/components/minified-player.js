import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleUp,
  faPlayCircle,
  faPauseCircle
} from "@fortawesome/free-solid-svg-icons";

import truncateString from "../utils/truncateString";
import styles from "../styles/player.module.css";

const MinifiedPlayer = ({
  current: {
    title,
    artist: { name: artistName }
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
    <button type="button" onClick={handleToggleExpand}>
      <FontAwesomeIcon icon={faAngleUp} />
    </button>
    <div className={styles.titleWrapper}>
      <div>
        <strong>{truncateString(title, 38)}</strong>
      </div>
      <div>{truncateString(artistName, 38)}</div>
    </div>
    <div>
      <button type="button" onClick={handlePlayPause}>
        <FontAwesomeIcon icon={isPlaying ? faPauseCircle : faPlayCircle} />
      </button>
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
