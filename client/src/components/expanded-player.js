import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import React from "react";

import {
  IconButton as BackwardButton,
  IconButton as CloseExpandedPlayerButton,
  IconButton as DesktopPlayPauseButton,
  IconButton as ForwardButton
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
  handlePrev,
  handleNext
}) => {
  const currentTrack = useSelector(state => state.player.currentTrack);
  const isPlaying = useSelector(state => state.player.isPlaying);
  const duration = useSelector(state => state.player.duration);
  const seek = useSelector(state => state.player.seek);

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
    </div>
  );
};

export default ExpandedPlayer;
