import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import React, { useState, useRef } from "react";

import { handlePlayTrack } from "../redux/actions/playerActions";
import { usePrevious } from "../utils/hooks";
import TrackItem from "./track-item";
import styles from "../styles/library.module.css";

const TrackList = ({
  search,
  hasNext,
  trackListId,
  songs,
  loadMoreTracks,
  currentTrackID,
  isPlaying
}) => {
  const incrementValue = search ? 5 : 25;
  const [numShowTracks, setNumShowTracks] = useState(incrementValue);
  const prevTracklistId = usePrevious(trackListId);
  const scrollContainer = useRef(null);
  const queueIndex = useSelector(state => state.player.index);
  const searchHasMoreToShow =
    search && (hasNext || numShowTracks < songs.length);
  const listHeight = Math.min(songs.length, numShowTracks);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (!songs.length && loadMoreTracks) {
      loadMoreTracks();
    }
  }, [songs, loadMoreTracks]);

  React.useEffect(() => {
    if (prevTracklistId === trackListId) return;

    setNumShowTracks(incrementValue);
    if (scrollContainer.current) {
      scrollContainer.current.scrollTo({ top: 0, left: 0 });
    }
  }, [prevTracklistId, trackListId]);

  function showMoreTracks() {
    setNumShowTracks(numShowTracks + incrementValue);
  }

  const loadTracksOnScroll = useLoadTracksOnScroll(
    songs,
    numShowTracks,
    showMoreTracks,
    loadMoreTracks
  );

  function dispatchPlayTrack(index) {
    dispatch(handlePlayTrack(index, songs));
  }

  function searchHandleLoad() {
    if (numShowTracks < songs.length) {
      showMoreTracks();
    } else {
      loadMoreTracks();
      showMoreTracks();
    }
  }

  return (
    <>
      <div
        ref={scrollContainer}
        className={`${styles.libraryWrapper} ${search && styles.searchWrapper}`}
        onScroll={loadTracksOnScroll}
        style={
          search && {
            height: `${65 * listHeight}px`,
            overflowY: "hidden"
          }
        }
      >
        {songs &&
          songs
            .slice(0, numShowTracks)
            .map((track, i) => (
              <TrackItem
                key={`${search ? "Search" : "Lib"}:${track.source}:${
                  track.id
                }:${i}`}
                track={track}
                handlePlay={dispatchPlayTrack}
                isActive={currentTrackID === track.id && i === queueIndex}
                isPlaying={isPlaying}
                index={i}
              />
            ))}
      </div>
      {searchHasMoreToShow && (
        <button
          type="button"
          onClick={searchHandleLoad}
          className={styles.showMoreButton}
        >
          {"Show More "}
          <FontAwesomeIcon icon={faAngleDown} />
        </button>
      )}
    </>
  );
};

function useLoadTracksOnScroll(
  tracks,
  numCurrentlyShown,
  showMoreTracks,
  loadMoreTracks
) {
  return function(e) {
    const eScrollTop = e.target.scrollTop;
    const eHeight = e.target.getBoundingClientRect().height;
    const eScrollHeight = e.target.scrollHeight - 10;
    if (eScrollTop + eHeight >= eScrollHeight) {
      showMoreTracks();
      if (tracks.length < numCurrentlyShown) {
        loadMoreTracks();
      }
    }
  };
}

TrackList.propTypes = {
  songs: PropTypes.arrayOf(PropTypes.object),
  handlePlay: PropTypes.func.isRequired,
  loadMoreTracks: PropTypes.func,
  isPlaying: PropTypes.bool.isRequired,
  currentTrackID: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired
};

TrackList.defaultProps = {
  songs: [],
  handlePlay: () => {},
  loadMoreTracks: null
};

export default TrackList;
