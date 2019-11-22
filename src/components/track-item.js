import React, { useState } from "react";
import LazyLoad from "react-lazyload";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEllipsisH } from "@fortawesome/free-solid-svg-icons";

import truncateString from "../utils/truncateString";
import msToDuration from "../utils/msToDuration";
import styles from "../styles/library.module.css";
import placeholderImg from "../assets/placeholder.png";

const TrackItem = ({
  title,
  img,
  artist,
  search,
  addToLibrary,
  ms,
  handlePlay,
  isActive,
  isPlaying
}) => {
  const [disable, setDisable] = useState(false);
  const handleDisable = () => {
    setDisable(true);
  };

  return (
    <LazyLoad height="5rem" once>
      <div
        className={`${styles.trackWrapper} ${isActive && styles.playingNow}`}
        onClick={handlePlay}
        role="button"
        tabIndex="0"
        onKeyPress={handlePlay}
        onTouchStart={() => {}}
      >
        <div className={styles.trackImageWrap}>
          <img
            src={img ? img.replace("large.jpg", "t67x67.jpg") : placeholderImg}
            alt="track"
          />
          {isActive && (
            <div className={styles.overlay}>
              <div className={`${styles.bar} ${!isPlaying && styles.paused}`} />
              <div
                className={`${styles.bar} ${styles.midBar} ${!isPlaying &&
                  styles.paused}`}
              />
              <div className={`${styles.bar} ${!isPlaying && styles.paused}`} />
            </div>
          )}
        </div>

        <div className={styles.titleWrapper}>
          <div>
            <strong>{truncateString(title, 38)}</strong>
          </div>
          <div>{truncateString(artist, 38)}</div>
        </div>
        <div className={styles.trackRightControls}>
          <div className={styles.duration}>{msToDuration(ms)}</div>
          {search && (
            <button
              type="button"
              onClick={(event, track) => {
                addToLibrary(event, track);
                handleDisable();
              }}
              disabled={disable}
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
          )}
          {!search && (
            <button type="button" onClick={e => e.stopPropagation()}>
              <FontAwesomeIcon icon={faEllipsisH} />
            </button>
          )}
        </div>
      </div>
    </LazyLoad>
  );
};

TrackItem.propTypes = {
  title: PropTypes.string.isRequired,
  artist: PropTypes.string.isRequired,
  img: PropTypes.string,
  search: PropTypes.bool,
  addToLibrary: PropTypes.func,
  ms: PropTypes.number.isRequired,
  handlePlay: PropTypes.func.isRequired,
  isActive: PropTypes.bool.isRequired,
  isPlaying: PropTypes.bool.isRequired
};

TrackItem.defaultProps = {
  img: "",
  search: false,
  addToLibrary: () => {}
};

export default TrackItem;
