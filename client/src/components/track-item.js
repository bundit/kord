import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import LazyLoad from "react-lazyload";
import PropTypes from "prop-types";
import React, { useEffect, useRef } from "react";

import { ICONS } from "../utils/constants";
import { IconButton, IconButton as ToggleDropDownButton } from "./buttons";
import { getImgUrl, msToDuration } from "../utils/formattingHelpers";
import ActiveImageOverlay from "./active-image-overlay";
import TrackDropdown from "./track-dropdown";
import TrackInfo from "./track-info";
import rippleEffect from "../utils/rippleEffect";
import styles from "../styles/track-item.module.scss";

const TrackItem = ({
  track,
  handlePlay,
  isActive,
  index,
  isFromSearch,
  isFromQueue,
  playlistId,
  handleRemove
}) => {
  const isPlaying = useSelector(state => state.player.isPlaying);
  const trackItemRef = useRef();

  const { duration: ms, source } = track;
  const isStreamable = track.streamable || track.streamable === null;
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  useDetectOutsideClick(trackItemRef, closeDropdown);

  function handlePlayTrack(e) {
    e.target.blur();
    if (isStreamable) {
      handlePlay(index);
    }
    e.stopPropagation();
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

  function closeDropdown() {
    setIsDropdownOpen(false);
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

  function getTrackWrapperClasses() {
    let className = styles.trackWrapper;

    if (isActive) {
      className += " " + styles.playingNow;
    }

    if (!isStreamable) {
      className += " " + styles.notStreamable;
    }

    if (isFromQueue) {
      className += " " + styles.queueTrackItem;
    }

    return className;
  }

  return (
    <div style={{ position: "relative" }} ref={trackItemRef}>
      <LazyLoad height={65} once>
        <div
          className={getTrackWrapperClasses()}
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
            style={isActive ? isActiveStyles : null}
          >
            <FontAwesomeIcon icon={ICONS[source]} size="2x" />
          </div>

          <ToggleDropDownButton
            onClick={toggleDropdown}
            onDoubleClick={stopPropagation}
            className={styles.trackSettingsButton}
            style={
              isDropdownOpen
                ? {
                    color: "#fb1",
                    ...isActiveStyles
                  }
                : isActive
                ? isActiveStyles
                : null
            }
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
          trackIndex={index}
          playlistId={playlistId}
          isFromSearch={isFromSearch}
          isFromQueue={isFromQueue}
        />
      )}
    </div>
  );
};

function useDetectOutsideClick(ref, callback) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
}

const isActiveStyles = {
  opacity: 1,
  display: "block",
  animation: "none"
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
  handlePlay: PropTypes.func.isRequired,
  isActive: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
  playlistId: PropTypes.string,
  isFromSearch: PropTypes.bool,
  isFromQueue: PropTypes.bool,
  handleRemove: PropTypes.func
};

TrackItem.defaultProps = {
  isFromSearch: false,
  isFromQueue: false,
  handleRemove: null,
  playlistId: ""
};

export default TrackItem;
