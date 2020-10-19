import {
  faAngleUp,
  faListUl,
  faKeyboard
} from "@fortawesome/free-solid-svg-icons";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import React, { useState, useRef } from "react";

import {
  IconButton as BackwardButton,
  IconButton as ControlsButton,
  IconButton as DesktopPlayPauseButton,
  IconButton as ForwardButton,
  IconButton as ExpandPlayerButton,
  PlayPauseButton,
  IconButton as QueueButton
} from "./buttons";
import { ReactComponent as BackwardIcon } from "../assets/backward.svg";
import { ReactComponent as ForwardIcon } from "../assets/forward.svg";
import { ReactComponent as PauseIcon } from "../assets/pause-button.svg";
import { ReactComponent as PlayIcon } from "../assets/play-button.svg";
import { getImgUrl } from "../utils/getImgUrl";
import { secondsToFormatted } from "../utils/formattingHelpers";
import {
  toggleKeyboardControlsMenu,
  toggleUserQueue
} from "../redux/actions/userActions";
import Image from "./image";
import TrackInfo from "./track-info";
import UserQueue from "./user-queue";
import VolumeControls from "./volume-controls";
import progressBarStyles from "../styles/progressBar.module.css";
import styles from "../styles/player.module.scss";

const MinifiedPlayer = ({
  handleToggleExpand,
  handlePlayPause,
  isUserSeeking,
  userSeekPos,
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
  const player = useSelector(state => state.player, shallowEqual);
  const { currentTrack, isPlaying, seek, duration } = player;

  function handleToggleShowQueue() {
    dispatch(toggleUserQueue());
  }

  function handleToggleShowControls() {
    dispatch(toggleKeyboardControlsMenu());
  }

  function getImgClassName() {
    const { source } = currentTrack;

    return `${styles.playerImage} ${source === "youtube" && styles.ytImage}`;
  }

  return (
    <div className={styles.playerAndSeekContainer}>
      <ProgressBar
        isUserSeeking={isUserSeeking}
        userSeekPos={userSeekPos}
        handleOnChangeUserSeek={handleOnChangeUserSeek}
        handleMouseDownSeek={handleMouseDownSeek}
        handleMouseUpSeek={handleMouseUpSeek}
      />

      {/* MOBILE */}
      <div
        className={styles.mobilePlayerWrapper}
        tabIndex={0}
        onClick={handleToggleExpand}
      >
        <ExpandPlayerButton onClick={handleToggleExpand} icon={faAngleUp} />
        <div className={styles.nowPlaying}>
          <TrackInfo track={currentTrack} isPlayer />
        </div>
        <PlayPauseButton onClick={handlePlayPause} isPlaying={isPlaying} />
      </div>

      {/* DESKTOP */}
      <div className={styles.desktopPlayerWrapper}>
        <div className={styles.nowPlaying}>
          <Image
            src={getImgUrl(currentTrack, "md")}
            alt="album-art"
            className={getImgClassName()}
          />
          <TrackInfo track={currentTrack} isPlayer />
        </div>

        <div className={styles.backPlayForwardWrapper}>
          <span
            className={progressBarStyles.timeContainer}
            style={{ textAlign: "right" }}
          >
            {secondsToFormatted(isUserSeeking ? userSeekPos : seek || 0)}
          </span>
          <BackwardButton onClick={handlePrev}>
            <BackwardIcon />
          </BackwardButton>
          <DesktopPlayPauseButton onClick={handlePlayPause}>
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </DesktopPlayPauseButton>
          <ForwardButton onClick={handleNext}>
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

function ProgressBar({
  isUserSeeking,
  userSeekPos,
  handleOnChangeUserSeek,
  handleMouseDownSeek,
  handleMouseUpSeek
}) {
  const [hoverOffset, setHoverOffset] = useState(0);
  const [isUserHovering, setIsUserHovering] = useState(false);
  const seekWrap = useRef(null);
  const player = useSelector(state => state.player, shallowEqual);
  const { seek, duration } = player;

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

  const progressPercent = calculateProgressPercentage(
    seek,
    userSeekPos,
    isUserSeeking,
    duration
  );
  const timeRatio = calculateTimeRatioFromHoverPosition(
    hoverOffset,
    seekWrap.current && seekWrap.current.offsetWidth,
    duration
  );

  return (
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
  );
}

function calculateProgressPercentage(
  seek,
  userSeekPos,
  isUserSeeking,
  duration
) {
  const progress = (isUserSeeking ? userSeekPos : seek) / duration;

  return `${progress * 100}%`;
}

function calculateTimeRatioFromHoverPosition(
  hoverOffset,
  containerWidth,
  duration
) {
  const hoverRatio = Number(hoverOffset) / Number(containerWidth);

  return hoverRatio * duration;
}

export default MinifiedPlayer;
