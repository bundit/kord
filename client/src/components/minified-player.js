import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleUp,
  faPlay,
  faPauseCircle,
  faListUl,
  faKeyboard
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import React, { useState, useRef } from "react";

import { ReactComponent as BackwardIcon } from "../assets/backward.svg";
import { ReactComponent as ForwardIcon } from "../assets/forward.svg";
import { ReactComponent as PauseIcon } from "../assets/pause-button.svg";
import { ReactComponent as PlayIcon } from "../assets/play-button.svg";
import {
  IconButton as QueueButton,
  IconButton as ControlsButton,
  IconButton as BackwardButton,
  IconButton as PlayPauseButton,
  IconButton as ForwardButton
} from "./buttons";
import { getImgUrl } from "../utils/getImgUrl";
import { secondsToFormatted } from "../utils/formattingHelpers";
import {
  toggleKeyboardControlsMenu,
  toggleUserQueue
} from "../redux/actions/userActions";
import { useMobileDetection } from "../utils/hooks";
import TrackInfo from "./track-info";
import UserQueue from "./user-queue";
import VolumeControls from "./volume-controls";
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

  const isMobile = useMobileDetection();

  const progress = (isUserSeeking ? userSeekPos : seek) / duration;
  const progressPercent = `${progress * 100}%`;

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

  function handleToggleShowQueue() {
    dispatch(toggleUserQueue());
  }

  function handleToggleShowControls() {
    dispatch(toggleKeyboardControlsMenu());
  }

  const forwardBackwardButtonStyle = {
    height: "30px",
    width: "30px",
    fontSize: "1.3"
  };

  const playPauseButtonStyle = {
    height: "50px",
    width: "50px",
    fontSize: "2rem",
    margin: "0 10px"
  };

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

          <BackwardButton
            onClick={handlePrev}
            style={{ ...forwardBackwardButtonStyle, marginLeft: "10px" }}
          >
            <BackwardIcon />
          </BackwardButton>
          <PlayPauseButton
            onClick={handlePlayPause}
            style={playPauseButtonStyle}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </PlayPauseButton>
          <ForwardButton
            onClick={handleNext}
            style={{ ...forwardBackwardButtonStyle, marginRight: "10px" }}
          >
            <ForwardIcon />
          </ForwardButton>
          <span className={progressBarStyles.timeContainer}>
            {secondsToFormatted(duration || 0)}
          </span>
        </div>
        <div className={styles.playerRightControls}>
          <ControlsButton
            onClick={handleToggleShowControls}
            icon={faKeyboard}
            size="sm"
          />
          <QueueButton
            onClick={handleToggleShowQueue}
            icon={faListUl}
            size="sm"
          />
          <VolumeControls
            isUserSettingVolume={isUserSettingVolume}
            userVolumeValue={userVolumeValue}
            handleOnChangeVolume={handleOnChangeVolume}
            handleMouseDownVolume={handleMouseDownVolume}
            handleMouseUpVolume={handleMouseUpVolume}
          />
        </div>
      </div>
      <UserQueue />
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
