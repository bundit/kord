import {
  faAngleUp,
  faListUl,
  faKeyboard,
  faRandom,
  faRetweet
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import React from "react";

import {
  IconButton as BackwardButton,
  IconButton as ControlsButton,
  IconButton as DesktopPlayPauseButton,
  IconButton as ExpandPlayerButton,
  IconButton as ForwardButton,
  IconButton as ShuffleButton,
  IconButton as RepeatButton,
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
import { toggleRepeat, toggleShuffle } from "../redux/actions/playerActions";
import Image from "./image";
import SeekBar from "./seek-bar";
import TrackInfo from "./track-info";
import VolumeControls from "./volume-controls";
import seekBarStyles from "../styles/seek-bar.module.scss";
import styles from "../styles/player.module.scss";

const MinifiedPlayer = ({
  isExpanded,
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
  const shuffleEnabled = useSelector(state => state.player.shuffleEnabled);
  const repeatEnabled = useSelector(state => state.player.repeatEnabled);
  const currentTrack = useSelector(state => state.player.currentTrack);
  const isPlaying = useSelector(state => state.player.isPlaying);
  const duration = useSelector(state => state.player.duration);
  const seek = useSelector(state => state.player.seek);
  const { source } = currentTrack;

  function handleToggleShowQueue() {
    dispatch(toggleUserQueue());
  }

  function handleToggleShowControls() {
    dispatch(toggleKeyboardControlsMenu());
  }

  function handleToggleShuffle() {
    dispatch(toggleShuffle());
  }

  function handleToggleRepeat() {
    dispatch(toggleRepeat());
  }

  function getImgClassName() {
    return `${styles.playerImage} ${source === "youtube" && styles.ytImage}`;
  }

  return (
    <div className={styles.playerAndSeekContainer}>
      <SeekBar
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
          <TrackInfo track={currentTrack} isPlayer preventAnchor />
        </div>
        <PlayPauseButton onClick={handlePlayPause} isPlaying={isPlaying} />
      </div>

      {/* DESKTOP */}
      <div
        className={`${styles.desktopPlayerWrapper} ${seekBarStyles.desktopPlayerWrapper}`}
      >
        <div className={styles.nowPlaying}>
          <Image
            src={getImgUrl(currentTrack, "md")}
            alt="album-art"
            className={getImgClassName()}
          />
          <TrackInfo track={currentTrack} isPlayer />
        </div>

        <div className={styles.centerControls}>
          <ShuffleButton
            icon={faRandom}
            onClick={handleToggleShuffle}
            style={{ color: shuffleEnabled ? "#ffc842" : null }}
          />
          <div className={styles.backPlayForwardWrapper}>
            <span
              className={seekBarStyles.timeContainer}
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
            <span className={seekBarStyles.timeContainer}>
              {secondsToFormatted(duration || 0)}
            </span>
          </div>
          <RepeatButton
            icon={faRetweet}
            onClick={handleToggleRepeat}
            style={{ color: repeatEnabled ? "#ffc842" : null }}
          />
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
    </div>
  );
};

export default MinifiedPlayer;
