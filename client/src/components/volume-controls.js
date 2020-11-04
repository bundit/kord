import {
  faVolumeMute,
  faVolumeDown,
  faVolumeUp
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import React from "react";

import { IconButton as MuteButton } from "./buttons";
import { setMuted } from "../redux/actions/playerActions";
import styles from "../styles/volume.module.scss";

function VolumeControls({
  isUserSettingVolume,
  userVolumeValue,
  handleOnChangeVolume,
  handleMouseDownVolume,
  handleMouseUpVolume,
  muteButtonClassName
}) {
  const dispatch = useDispatch();
  const isMuted = useSelector(state => state.player.isMuted);
  const volume = useSelector(state => state.player.volume);

  function handleToggleMute() {
    dispatch(setMuted(!isMuted));
  }

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

  return (
    <span className={styles.volumeWrapper}>
      <MuteButton
        onClick={handleToggleMute}
        icon={volumeIcon}
        className={muteButtonClassName}
      />
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
    </span>
  );
}

export default VolumeControls;
