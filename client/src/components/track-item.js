import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import {
  faSpotify,
  faSoundcloud,
  faYoutube
} from "@fortawesome/free-brands-svg-icons";
import PropTypes from "prop-types";
import React from "react";

import { formatArtistName, msToDuration } from "../utils/formattingHelpers";
import { getImgUrl } from "../utils/getImgUrl";
import placeholderImg from "../assets/track-placeholder.jpg";
import rippleEffect from "../utils/rippleEffect";
import styles from "../styles/library.module.css";

const TrackItem = ({ track, handlePlay, isActive, isPlaying, index }) => {
  const { title, duration: ms, artist, source } = track;
  const artistName = formatArtistName(artist);
  const isStreamable = track.streamable || track.streamable === null;

  function handlePlayTrack(e) {
    e.target.blur();
    if (isStreamable) {
      handlePlay(index);
    }
  }

  return (
    <div style={{ position: "relative" }}>
      <div
        className={`${styles.trackWrapper} ${isActive &&
          styles.playingNow} ${!isStreamable && styles.notStreamable}`}
        onClick={rippleEffect}
        onDoubleClick={handlePlayTrack}
        role="button"
        tabIndex="0"
        onKeyPress={handlePlayTrack}
      >
        <div className={styles.trackImageWrap}>
          <img
            className={styles.trackImage}
            src={track.img ? getImgUrl(track, "sm") : placeholderImg}
            alt="track"
          />
          {isStreamable && (
            <div className={styles.overlay}>
              {isPlaying && isActive ? (
                <>
                  <div
                    className={`${styles.bar} ${!isPlaying && styles.paused}`}
                  />
                  <div
                    className={`${styles.bar} ${styles.midBar} ${!isPlaying &&
                      styles.paused}`}
                  />
                  <div
                    className={`${styles.bar} ${!isPlaying && styles.paused}`}
                  />
                </>
              ) : (
                <button
                  onClick={handlePlayTrack}
                  className={styles.trackPlayButton}
                >
                  <FontAwesomeIcon icon={faPlay} size="lg" />
                </button>
              )}
            </div>
          )}
        </div>

        <div className={styles.titleWrapper}>
          <div>
            <strong>{title}</strong>
          </div>
          <div className={styles.stackedArtistName}>{artistName}</div>
        </div>
        <div className={styles.singleSource} style={{ opacity: isActive && 1 }}>
          <FontAwesomeIcon
            icon={
              source === "spotify"
                ? faSpotify
                : source === "soundcloud"
                ? faSoundcloud
                : faYoutube
            }
            size="2x"
          />
        </div>
        <div className={styles.trackRightControls}>
          <div className={styles.duration}>{msToDuration(ms)}</div>
        </div>
      </div>
    </div>
  );
};

TrackItem.propTypes = {
  track: PropTypes.shape({
    title: PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired,
    artist: PropTypes.oneOfType([
      PropTypes.shape({ name: PropTypes.string.isRequired }),
      PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string.isRequired }))
    ])
  }).isRequired,
  search: PropTypes.bool,
  addToLibrary: PropTypes.func,
  handlePlay: PropTypes.func.isRequired,
  isActive: PropTypes.bool.isRequired,
  isPlaying: PropTypes.bool.isRequired
};

TrackItem.defaultProps = {
  search: false
};

export default TrackItem;
