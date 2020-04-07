import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleUp,
  faPlay,
  faPauseCircle
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import React from "react";

import { ReactComponent as BackwardIcon } from "../assets/backward.svg";
import { ReactComponent as ForwardIcon } from "../assets/forward.svg";
import { ReactComponent as PauseIcon } from "../assets/pause-button.svg";
import { ReactComponent as PlayIcon } from "../assets/play-button.svg";
import { formatArtistName } from "../utils/formatArtistName";
import { getImgUrl } from "../utils/getImgUrl";
import { nextTrack, prevTrack } from "../redux/actions/playerActions";
import { useMobileDetection } from "../utils/hooks";
import placeholderImg from "../assets/placeholder.png";
import styles from "../styles/player.module.css";

const MinifiedPlayer = ({
  current,
  handleToggleExpand,
  handlePlayPause,
  isPlaying
}) => {
  const isMobile = useMobileDetection();
  const dispatch = useDispatch();

  return (
    <div
      className={`${styles.playerWrapper} ${styles.miniPlayer}`}
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
        <div className={styles.miniPlayerImageWrap}>
          <img
            src={current.img ? getImgUrl(current, "md") : placeholderImg}
            alt="album-art"
          />
        </div>
        <div className={styles.titleWrapper}>
          <div className={styles.nowPlayingTitle}>{current.title}</div>
          <div className={styles.nowPlayingArtist}>
            {formatArtistName(current.artist)}
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={handlePlayPause}
        className={styles.miniPlayerPlayButton}
      >
        <FontAwesomeIcon icon={isPlaying ? faPauseCircle : faPlay} />
      </button>
      <div className={styles.desktopButtonGroup}>
        <button
          type="button"
          className={styles.backwardButton}
          onClick={() => dispatch(prevTrack())}
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
          onClick={() => dispatch(nextTrack())}
        >
          <ForwardIcon />
        </button>
      </div>

      <div className={styles.volumeSlider}>
        <input type="range" className={styles.slider} />
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
