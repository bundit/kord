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
import { toggleKeyboardControlsMenu } from "../redux/actions/userActions";
import Image from "./image";
import SeekBar from "./seek-bar";
import TrackInfo from "./track-info";
import VolumeControls from "./volume-controls";
import seekBarStyles from "../styles/seek-bar.module.scss";
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
  handleNext,
  handleToggleShuffle,
  handleToggleRepeat,
  handleToggleQueue
}) => {
  const dispatch = useDispatch();
  const shuffleEnabled = useSelector(state => state.player.shuffleEnabled);
  const repeatEnabled = useSelector(state => state.player.repeatEnabled);
  const currentTrack = useSelector(state => state.player.currentTrack);
  const isPlaying = useSelector(state => state.player.isPlaying);
  const duration = useSelector(state => state.player.duration);
  const isMuted = useSelector(state => state.player.isMuted);
  const seek = useSelector(state => state.player.seek);
  const isKeyboardControlsOpen = useSelector(
    state => state.user.settings.isKeyboardControlsOpen
  );
  const isUserQueueOpen = useSelector(
    state => state.user.settings.isUserQueueOpen
  );
  const { source } = currentTrack;

  function handleToggleShowControls() {
    dispatch(toggleKeyboardControlsMenu());
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
            className={shuffleEnabled ? styles.enabledButton : undefined}
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
            className={repeatEnabled ? styles.enabledButton : undefined}
          />
        </div>

        <div className={styles.playerRightControls}>
          <ControlsButton
            onClick={handleToggleShowControls}
            icon={faKeyboard}
            className={
              isKeyboardControlsOpen ? styles.enabledButton : undefined
            }
          />
          <QueueButton
            onClick={handleToggleQueue}
            icon={faListUl}
            className={isUserQueueOpen ? styles.enabledButton : undefined}
          />
          <VolumeControls
            isUserSettingVolume={isUserSettingVolume}
            userVolumeValue={userVolumeValue}
            handleOnChangeVolume={handleOnChangeVolume}
            handleMouseDownVolume={handleMouseDownVolume}
            handleMouseUpVolume={handleMouseUpVolume}
            muteButtonClassName={isMuted ? styles.enabledButton : undefined}
          />
        </div>
      </div>
    </div>
  );
};

export default MinifiedPlayer;
