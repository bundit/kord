import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faEllipsisH,
  faEllipsisV
} from "@fortawesome/free-solid-svg-icons";
import LazyLoad from "react-lazyload";
import PropTypes from "prop-types";
import React, { useState, useRef, useEffect } from "react";

import { formatArtistName } from "../utils/formatArtistName";
import { getImgUrl } from "../utils/getImgUrl";
import TrackDropdown from "./track-dropdown";
import msToDuration from "../utils/msToDuration";
import placeholderImg from "../assets/placeholder.png";
import rippleEffect from "../utils/rippleEffect";
import styles from "../styles/library.module.css";

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
  const { title, duration: ms, artist, genre, source } = track;
  // Keep a reference to detect clicks outside of target area
  const trackItemRef = useRef();
  const [disable, setDisable] = useState(false);
  const handleDisable = () => {
    setDisable(true);
  };

  const artistName = formatArtistName(artist);

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
    <div className={styles.relativeWrapper} ref={trackItemRef}>
      <LazyLoad height={60} overflow={true} offset={200}>
        <div
          className={`${styles.trackWrapper} ${isActive && styles.playingNow}`}
          onClick={e => {
            // handlePlay();
            rippleEffect(e);
          }}
          onDoubleClick={handlePlay}
          role="button"
          tabIndex="0"
          onKeyPress={handlePlay}
        >
          <div className={styles.trackImageWrap}>
            <img
              className={styles.trackImage}
              src={track.img ? getImgUrl(track, "sm") : placeholderImg}
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
              <strong>{title}</strong>
            </div>
            <div className={styles.stackedArtistName}>
              {artistName.toString()}
            </div>
          </div>
          <div className={styles.singleArtistName}>{artistName.toString()}</div>
          <div className={styles.singleGenre}>{genre}</div>
          <div className={styles.singleSource}>{source}</div>
          <div className={styles.singleTime}>{msToDuration(ms)}</div>
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
                className={`${styles.dropDownButton} ${
                  isDropdownOpen ? styles.activeDropDown : ""
                }`}
              >
                <span className={styles.ellipsisH}>
                  <FontAwesomeIcon icon={faEllipsisH} />
                </span>
                <span className={styles.ellipsisV}>
                  <FontAwesomeIcon size="2x" icon={faEllipsisV} />
                </span>
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
      </LazyLoad>
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
