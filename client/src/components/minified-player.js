import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleUp,
  faPlay,
  faPauseCircle,
  faVolumeMute,
  faVolumeDown,
  faVolumeUp
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import React, { useState, useRef } from "react";

import { ReactComponent as BackwardIcon } from "../assets/backward.svg";
import { ReactComponent as ForwardIcon } from "../assets/forward.svg";
import { ReactComponent as PauseIcon } from "../assets/pause-button.svg";
import { ReactComponent as PlayIcon } from "../assets/play-button.svg";
import { getImgUrl } from "../utils/getImgUrl";
import { secondsToFormatted } from "../utils/formattingHelpers";
import { setMuted } from "../redux/actions/playerActions";
import { useMobileDetection } from "../utils/hooks";
import TrackInfo from "./track-info";
import progressBarStyles from "../styles/progressBar.module.css";
import styles from "../styles/player.module.css";

const MinifiedPlayer = ({
  current,
  handleToggleExpand,
  handlePlayPause,
  isPlaying,
  isUserSeeking,
  userSeekPos,
  seek,
  volume,
  duration,
  handleOnChangeUserSeek,
  handleMouseDownSeek,
  handleMouseUpSeek,
  isUserSettingVolume,
  userVolumeValue,
  handleOnChangeVolume,
  handleMouseDownVolume,
  handleMouseUpVolume,
  handlePrev,
  handleNext
}) => {
  const dispatch = useDispatch();
  const [hoverOffset, setHoverOffset] = useState(0);
  const [isUserHovering, setIsUserHovering] = useState(false);
  const seekWrap = useRef(null);

  const isMuted = useSelector(state => state.player.isMuted);

  const isMobile = useMobileDetection();

  const progress = (isUserSeeking ? userSeekPos : seek) / duration;
  const progressPercent = `${progress * 100}%`;

  const currentVolumeValue = isMuted
    ? 0
    : Number(isUserSettingVolume ? userVolumeValue : volume);
  const sliderWidth = 125; // px

  const volumeWidth = currentVolumeValue * sliderWidth;
  const volumeRight = sliderWidth - volumeWidth;

  const volumeIcon =
    currentVolumeValue === 0
      ? faVolumeMute
      : currentVolumeValue < 0.5
      ? faVolumeDown
      : faVolumeUp;

  const hoverRatio =
    Number(hoverOffset) /
    Number(seekWrap.current ? seekWrap.current.offsetWidth : 1);
  const timeRatio = hoverRatio * duration;

  function getPositionOnHover(e) {
    setIsUserHovering(true);

    const parentEl = e.target.getClientRects()[0];

    if (parentEl) {
      const elementLeftOffset = e.target.offsetLeft + e.clientX - parentEl.left;
      setHoverOffset(elementLeftOffset);
    }
  }

  function handleMouseOut() {
    setIsUserHovering(false);
  }

  function handleToggleMute() {
    dispatch(setMuted(!isMuted));
  }

  return (
    <div className={styles.playerAndSeekContainer}>
      <div
        className={progressBarStyles.progressContainer}
        ref={seekWrap}
        onMouseMove={getPositionOnHover}
        onMouseOut={handleMouseOut}
      >
        <input
          className={progressBarStyles.desktopSeekBar}
          type="range"
          min="0"
          max={parseInt(duration || 0)}
          step="any"
          value={isUserSeeking ? userSeekPos : seek || 0}
          onChange={handleOnChangeUserSeek}
          onMouseDown={handleMouseDownSeek}
          onMouseUp={handleMouseUpSeek}
        />
        <span className={progressBarStyles.progressTrack}></span>
        <span
          className={progressBarStyles.progressBar}
          style={{ width: progressPercent }}
        ></span>
        <span
          className={progressBarStyles.seekToolTip}
          style={{ left: `${hoverOffset - 20}px` }}
        >
          <span
            className={`${progressBarStyles.hoverTime} ${isUserHovering &&
              progressBarStyles.isHovering}`}
          >
            {secondsToFormatted(timeRatio || 0)}
          </span>
        </span>
      </div>
      <div
        className={`${styles.playerWrapper} ${styles.miniPlayer} ${progressBarStyles.playerWrapper}`}
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
          <div
            className={styles.miniPlayerImageWrap}
            style={
              current.source === "youtube"
                ? { minWidth: "100px", height: "56px" }
                : {}
            }
          >
            <img src={getImgUrl(current, "md")} alt="album-art" />
          </div>
          <TrackInfo track={current} isPlayer />
        </div>
        <button
          type="button"
          onClick={handlePlayPause}
          className={styles.miniPlayerPlayButton}
        >
          <FontAwesomeIcon icon={isPlaying ? faPauseCircle : faPlay} />
        </button>
        <div className={styles.desktopButtonGroup}>
          <span
            className={progressBarStyles.timeContainer}
            style={{ textAlign: "right" }}
          >
            {secondsToFormatted(isUserSeeking ? userSeekPos : seek || 0)}
          </span>
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
          <span className={progressBarStyles.timeContainer}>
            {secondsToFormatted(duration || 0)}
          </span>
        </div>

        <div className={styles.volumeWrapper}>
          <button
            type="button"
            onClick={handleToggleMute}
            className={styles.volumeIconButton}
          >
            <FontAwesomeIcon icon={volumeIcon} size="sm" />
          </button>

          <span
            className={styles.volumeLowerFill}
            style={{ width: volumeWidth, right: volumeRight }}
          ></span>
          <input
            type="range"
            className={styles.volumeSlider}
            value={isUserSettingVolume ? userVolumeValue : volume}
            min="0"
            max="1"
            step="0.05"
            onChange={handleOnChangeVolume}
            onMouseDown={handleMouseDownVolume}
            onMouseUp={handleMouseUpVolume}
          />
        </div>
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
