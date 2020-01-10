import React, { useState, useRef, useEffect } from "react";
import LazyLoad from "react-lazyload";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEllipsisH } from "@fortawesome/free-solid-svg-icons";

import TrackDropdown from "./track-dropdown";
import rippleEffect from "../utils/rippleEffect";
import truncateString from "../utils/truncateString";
import msToDuration from "../utils/msToDuration";
import styles from "../styles/library.module.css";
import placeholderImg from "../assets/placeholder.png";

function addListenersToDocument(events, callback) {
  events.forEach(e => document.addEventListener(e, callback));
}

function removeListenersOnDocument(events, callback) {
  events.forEach(e => document.removeEventListener(e, callback));
}

function handleClickOutside(e, ref, events, callback, handler) {
  // Check if the click was inside the target or if a scroll action was made
  if (!ref.current.contains(e.target) || e.type === "scrollstart") {
    callback();
    removeListenersOnDocument(events, handler);
  }
}

const TrackItem = ({
  track,
  search,
  handlePlay,
  addToLibrary,
  isActive,
  isPlaying,
  toggleAddToPlaylistForm,
  toggleEditTrackForm,
  toggleDeleteTrackForm
}) => {
  const {
    title,
    img,
    duration: ms,
    artist: { name: artist }
  } = track;
  // Keep a reference to detect clicks outside of target area
  const trackItemRef = useRef();
  const [disable, setDisable] = useState(false);
  const handleDisable = () => {
    setDisable(true);
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const events = ["mousedown", "touchstart", "scrollstart"];
  function handler(e) {
    handleClickOutside(
      e,
      trackItemRef,
      events,
      () => setIsDropdownOpen(false),
      handler
    );
  }

  const toggleDropdown = () => {
    if (!isDropdownOpen) {
      addListenersToDocument(events, handler);
    } else {
      removeListenersOnDocument(events, handler);
    }

    setIsDropdownOpen(!isDropdownOpen);
  };

  // componentWillUnmount - cleanup listeners if there are any
  useEffect(
    () => () => {
      removeListenersOnDocument(events, handler);
    },
    []
  );

  return (
    <LazyLoad height="5rem" once>
      <div style={{ position: "relative" }}>
        <div
          ref={trackItemRef}
          className={`${styles.trackWrapper} ${isActive && styles.playingNow}`}
          onClick={e => {
            handlePlay();
            rippleEffect(e);
          }}
          role="button"
          tabIndex="0"
          onKeyPress={handlePlay}
          onTouchStart={() => {}}
        >
          <div className={styles.trackImageWrap}>
            <img
              className={styles.trackImage}
              src={
                img ? img.replace("large.jpg", "t67x67.jpg") : placeholderImg
              }
              alt="track"
            />
            {isActive && (
              <div className={styles.overlay}>
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
                onClick={event => {
                  addToLibrary(event, track);
                  toggleAddToPlaylistForm();
                  handleDisable();
                }}
                disabled={disable}
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>
            )}
            {!search && (
              <button
                type="button"
                onClick={e => {
                  toggleDropdown();
                  e.stopPropagation();
                }}
                style={{ color: `${isDropdownOpen ? "red" : "black"}` }}
              >
                <FontAwesomeIcon icon={faEllipsisH} />
              </button>
            )}
          </div>
        </div>
        {isDropdownOpen && (
          <TrackDropdown
            toggleAddToPlaylistForm={toggleAddToPlaylistForm}
            toggleDropdown={toggleDropdown}
            toggleEditTrackForm={toggleEditTrackForm}
            toggleDeleteTrackForm={toggleDeleteTrackForm}
            track={track}
          />
        )}
      </div>
    </LazyLoad>
  );
};

TrackItem.propTypes = {
  track: PropTypes.shape({
    title: PropTypes.string.isRequired,
    img: PropTypes.string,
    duration: PropTypes.number.isRequired,
    artist: PropTypes.shape({ name: PropTypes.string.isRequired })
  }).isRequired,
  search: PropTypes.bool,
  addToLibrary: PropTypes.func,
  handlePlay: PropTypes.func.isRequired,
  isActive: PropTypes.bool.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  toggleAddToPlaylistForm: PropTypes.func.isRequired,
  toggleEditTrackForm: PropTypes.func.isRequired,
  toggleDeleteTrackForm: PropTypes.func.isRequired
};

TrackItem.defaultProps = {
  search: false,
  addToLibrary: () => {}
};

export default TrackItem;
