import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV, faTimes } from "@fortawesome/free-solid-svg-icons";
import {
  faSpotify,
  faSoundcloud,
  faYoutube
} from "@fortawesome/free-brands-svg-icons";
import LazyLoad from "react-lazyload";
import PropTypes from "prop-types";
import React from "react";

import { IconButton, IconButton as ToggleDropDownButton } from "./buttons";
import { getImgUrl } from "../utils/getImgUrl";
import { msToDuration } from "../utils/formattingHelpers";
import ActiveImageOverlay from "./active-image-overlay";
import TrackDropdown from "./track-dropdown";
import TrackInfo from "./track-info";
import rippleEffect from "../utils/rippleEffect";
import styles from "../styles/track-item.module.scss";

const TrackItem = ({
  track,
  handlePlay,
  isActive,
  isPlaying,
  index,
  search,
  isFromQueue,
  playlistId,
  handleRemove
}) => {
  const { duration: ms, source } = track;
  const isStreamable = track.streamable || track.streamable === null;
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  function handlePlayTrack(e) {
    e.target.blur();
    if (isStreamable) {
      handlePlay(index);
    }
  }

  function toggleDropdown(e) {
    if (!isDropdownOpen) {
      addScrollListener();
    } else {
      removeScrollListener();
    }

    setIsDropdownOpen(!isDropdownOpen);

    if (e) {
      e.stopPropagation();
    }
  }

  function stopPropagation(e) {
    e.stopPropagation();
  }

  function scrollListener() {
    setIsDropdownOpen(false);
    removeScrollListener();
  }

  function addScrollListener() {
    window.addEventListener("scroll", scrollListener, true);
  }

  function removeScrollListener() {
    window.removeEventListener("scroll", scrollListener, true);
  }

  function handleRemoveFromQueue() {
    handleRemove(index);
  }
  return (
    <div style={{ position: "relative" }}>
      <LazyLoad height={65} once>
        <div
          className={`${styles.trackWrapper} ${isActive &&
            styles.playingNow} ${!isStreamable &&
            styles.notStreamable} ${isFromQueue && styles.queueTrackItem}`}
          onClick={rippleEffect}
          onDoubleClick={handlePlayTrack}
          role="button"
          tabIndex="0"
          onKeyPress={handlePlayTrack}
        >
          <div className={styles.trackImageWrap}>
            <img
              className={styles.trackImage}
              src={getImgUrl(track, "sm")}
              alt="track"
            />
            {isStreamable && (
              <ActiveImageOverlay
                isPlaying={isPlaying}
                isActive={isActive}
                handlePlayTrack={handlePlayTrack}
              />
            )}
          </div>
          <TrackInfo track={track} />
          <div
            className={styles.singleSource}
            style={{ opacity: isActive && 1 }}
          >
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

          <ToggleDropDownButton
            onClick={toggleDropdown}
            onDoubleClick={stopPropagation}
            className={styles.trackSettingsButton}
            style={isDropdownOpen ? { color: "#fb1", opacity: 1 } : null}
            icon={faEllipsisV}
            size="lg"
          />

          <div className={styles.trackRightControls}>
            {handleRemove && (
              <IconButton
                onClick={handleRemoveFromQueue}
                className={styles.removeFromQueueButton}
                icon={faTimes}
                size="lg"
              />
            )}
            <div
              className={styles.duration}
              style={{ display: !handleRemove ? "block" : null }}
            >
              {isNaN(ms) ? ms : msToDuration(ms)}
            </div>
          </div>
        </div>
      </LazyLoad>
      {isDropdownOpen && (
        <TrackDropdown
          toggleDropdown={toggleDropdown}
          track={track}
          search={search}
          trackIndex={index}
          playlistId={playlistId}
          isFromQueue={isFromQueue}
        />
      )}
    </div>
  );
};

TrackItem.propTypes = {
  track: PropTypes.shape({
    title: PropTypes.string.isRequired,
    duration: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
      .isRequired,
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
