import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlayCircle,
  faPauseCircle,
  faForward,
  faBackward,
  faAngleDown
  // faFastForward,
  // faFastBackward
} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import React from "react";

import { formatArtistName } from "../utils/formatArtistName";
import { getImgUrl } from "../utils/getImgUrl";
import placeholderImg from "../assets/placeholder.png";
import secondsToFormatted from "../utils/secondsToFormatted";
import styles from "../styles/player.module.css";

const ExpandedPlayer = ({
  current,
  handleToggleExpand,
  handlePlayPause,
  isPlaying,
  handlePrev,
  handleNext,
  // handleSeek,
  isUserSeeking,
  userSeekPos,
  seek,
  duration,
  handleOnChangeUserSeek,
  renderSeekPos,
  handleMouseDownSeek,
  handleMouseUpSeek
}) => (
  <div className={`${styles.playerWrapper} ${styles.playerOpen}`}>
    <button
      type="button"
      onClick={handleToggleExpand}
      className={styles.closeButton}
    >
      <FontAwesomeIcon icon={faAngleDown} size="2x" />
    </button>
    <img
      src={current.img ? getImgUrl(current, "lg") : placeholderImg}
      alt="album-artwork.jpg"
    />
    {/* SEEK INPUT */}
    <div className={styles.volumeContainer}>
      <span>
        {isUserSeeking
          ? secondsToFormatted(userSeekPos)
          : secondsToFormatted(seek)}
      </span>
      <span className={styles.sliderContainer}>
        <input
          type="range"
          min="0"
          max={duration}
          step="any"
          value={isUserSeeking ? userSeekPos : seek}
          onChange={isUserSeeking ? handleOnChangeUserSeek : renderSeekPos}
          onMouseDown={handleMouseDownSeek}
          onMouseUp={handleMouseUpSeek}
          onTouchStart={handleMouseDownSeek}
          onTouchEnd={handleMouseUpSeek}
        />
      </span>
      <span>{secondsToFormatted(duration)}</span>
    </div>
    <div className={styles.titleWrapperExpanded}>
      <div>
        <strong>{current.title}</strong>
      </div>
      <div>{formatArtistName(current.artist)}</div>
    </div>
    <div className={styles.expandedPlayerControls}>
      <button type="button" onClick={handlePrev}>
        <FontAwesomeIcon icon={faBackward} size="3x" />
      </button>
      {/* <button type="button" onClick={() => handleSeek(-15)}>
        <FontAwesomeIcon icon={faFastBackward} size="2x" />
      </button> */}
      <button type="button" onClick={handlePlayPause}>
        <FontAwesomeIcon
          size="6x"
          icon={isPlaying ? faPauseCircle : faPlayCircle}
        />
      </button>
      {/* <button type="button" onClick={() => handleSeek(15)}>
        <FontAwesomeIcon icon={faFastForward} size="2x" />
      </button> */}
      <button type="button" onClick={handleNext}>
        <FontAwesomeIcon icon={faForward} size="3x" />
      </button>
    </div>
  </div>
);

ExpandedPlayer.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  current: PropTypes.object.isRequired,
  handleToggleExpand: PropTypes.func.isRequired,
  handlePlayPause: PropTypes.func.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  handlePrev: PropTypes.func.isRequired,
  handleNext: PropTypes.func.isRequired,
  // handleSeek: PropTypes.func.isRequired,
  isUserSeeking: PropTypes.bool.isRequired,
  userSeekPos: PropTypes.number.isRequired,
  seek: PropTypes.number.isRequired,
  duration: PropTypes.number.isRequired,
  handleOnChangeUserSeek: PropTypes.func.isRequired,
  renderSeekPos: PropTypes.func.isRequired,
  handleMouseDownSeek: PropTypes.func.isRequired,
  handleMouseUpSeek: PropTypes.func.isRequired
};

export default ExpandedPlayer;
