import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import React, { useState, useRef } from "react";

import { usePrevious } from "../utils/hooks";
import TrackItem from "./track-item";
import styles from "../styles/library.module.css";

const TrackList = ({
  trackListId,
  songs,
  handlePlay,
  loadMoreTracks,
  currentTrackID,
  isPlaying
}) => {
  const incrementValue = 15;
  const [numShowTracks, setNumShowTracks] = useState(incrementValue);
  const prevTracklistId = usePrevious(trackListId);
  const scrollContainer = useRef(null);
  const queueIndex = useSelector(state => state.player.index);

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

  function handlePlayTrack(track) {
    handlePlay(track, songs);
  }

  return (
    <div
      ref={scrollContainer}
      className={styles.libraryWrapper}
      onScroll={loadTracksOnScroll}
    >
      {songs &&
        songs
          .slice(0, numShowTracks)
          .map((track, i) => (
            <TrackItem
              key={`${track.id}${track.source}${i}`}
              track={track}
              handlePlay={handlePlayTrack}
              isActive={currentTrackID === track.id && i === queueIndex}
              isPlaying={isPlaying}
            />
          ))}
    </div>
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
