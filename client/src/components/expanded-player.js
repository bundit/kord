import {
  faAngleDown,
  faRandom,
  faRetweet,
  faListUl,
  faVolumeMute,
  faVolumeUp
} from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import React from "react";

import {
  IconButton as BackwardButton,
  IconButton as CloseExpandedPlayerButton,
  IconButton as DesktopPlayPauseButton,
  IconButton as ForwardButton,
  IconButton as ShuffleButton,
  IconButton as RepeatButton,
  IconButton as QueueButton,
  IconButton as MuteButton
} from "./buttons";
import { ReactComponent as BackwardIcon } from "../assets/backward.svg";
import { ReactComponent as ForwardIcon } from "../assets/forward.svg";
import { ReactComponent as PauseIcon } from "../assets/pause-button.svg";
import { ReactComponent as PlayIcon } from "../assets/play-button.svg";
import { getImgUrl } from "../utils/getImgUrl";
import { secondsToFormatted } from "../utils/formattingHelpers";
import Image from "./image";
import SeekBar from "./seek-bar";
import TrackInfo from "./track-info";
import styles from "../styles/player.module.scss";

const ExpandedPlayer = ({
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
  handleToggleQueue,
  handleToggleMute
}) => {
  const shuffleEnabled = useSelector(state => state.player.shuffleEnabled);
  const repeatEnabled = useSelector(state => state.player.repeatEnabled);
  const currentTrack = useSelector(state => state.player.currentTrack);
  const isPlaying = useSelector(state => state.player.isPlaying);
  const duration = useSelector(state => state.player.duration);
  const isMuted = useSelector(state => state.player.isMuted);
  const volume = useSelector(state => state.player.volume);
  const seek = useSelector(state => state.player.seek);
  const isUserQueueOpen = useSelector(
    state => state.user.settings.isUserQueueOpen
  );

  function getImgClassName() {
    if (currentTrack.source === "youtube") {
      return styles.expandedYtImage;
    }
    return styles.expandedPlayerImageWrapper;
  }

  return (
    <div className={styles.expandedPlayer}>
      <div className={styles.expandedPlayerHeader}>
        <CloseExpandedPlayerButton
          onClick={handleToggleExpand}
          icon={faAngleDown}
        />
      </div>
      <div className={getImgClassName()} onClick={handlePlayPause}>
        <Image
          src={getImgUrl(currentTrack, "lg")}
          alt="album-artwork"
          style={{ width: "inherit", height: "inherit" }}
        />
      </div>
      {/* SEEK INPUT */}
      <div className={styles.nowPlaying}>
        <TrackInfo track={currentTrack} />
      </div>
      <div className={styles.seekBarWrapper} style={{ alignSelf: "stretch" }}>
        <span>
          {secondsToFormatted(isUserSeeking ? userSeekPos : seek || 0)}
        </span>
        <SeekBar
          isUserSeeking={isUserSeeking}
          userSeekPos={userSeekPos}
          handleOnChangeUserSeek={handleOnChangeUserSeek}
          handleMouseDownSeek={handleMouseDownSeek}
          handleMouseUpSeek={handleMouseUpSeek}
          isLargerSeekBar
          withThumb
        />
        <span>{secondsToFormatted(duration)}</span>
      </div>

      <div className={styles.mobileCenterControls}>
        <MuteButton
          icon={isMuted ? faVolumeMute : faVolumeUp}
          onClick={handleToggleMute}
          className={isMuted ? styles.enabledButton : undefined}
        />
        <label htmlFor="mobile-volume" className={styles.mobileVolume}>
          <input
            id="mobile-volume"
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isUserSettingVolume ? userVolumeValue : isMuted ? 0 : volume}
            onMouseDown={handleMouseDownVolume}
            onMouseUp={handleMouseUpVolume}
            onChange={handleOnChangeVolume}
          />
        </label>

        <ShuffleButton
          icon={faRandom}
          onClick={handleToggleShuffle}
          className={shuffleEnabled ? styles.enabledButton : undefined}
        />
        <div className={styles.mobileBackPlayForwardWrapper}>
          <BackwardButton onClick={handlePrev}>
            <BackwardIcon />
          </BackwardButton>
          <DesktopPlayPauseButton onClick={handlePlayPause}>
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </DesktopPlayPauseButton>
          <ForwardButton onClick={handleNext}>
            <ForwardIcon />
          </ForwardButton>
        </div>
        <RepeatButton
          icon={faRetweet}
          onClick={handleToggleRepeat}
          className={repeatEnabled ? styles.enabledButton : undefined}
        />

        <QueueButton
          onClick={handleToggleQueue}
          icon={faListUl}
          className={isUserQueueOpen ? styles.enabledButton : undefined}
        />
      </div>
    </div>
  );
};

export default ExpandedPlayer;
