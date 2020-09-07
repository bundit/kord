import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import React from "react";

import TrackItem from "./track-item";

const TrackList = ({
  search,
  tracks,
  handlePlay,
  currentTrackID,
  isPlaying,
  playlistId
}) => {
  const queueIndex = useSelector(state => state.player.index);
  const playingContext = useSelector(state => state.player.context);

  return (
    tracks &&
    tracks.map((track, i) => (
      <TrackItem
        key={`${search ? "Search" : "Lib"}:${track.source}:${track.id}:${i}`}
        track={track}
        handlePlay={handlePlay}
        isActive={
          currentTrackID === track.id &&
          i === queueIndex &&
          playingContext.id === playlistId
        }
        isPlaying={isPlaying}
        index={i}
        search={search}
        playlistId={playlistId}
      />
    ))
  );
};

TrackList.propTypes = {
  tracks: PropTypes.arrayOf(PropTypes.object),
  search: PropTypes.bool,
  isPlaying: PropTypes.bool.isRequired,
  currentTrackID: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired
};

TrackList.defaultProps = {
  tracks: [],
  search: false
};

export default TrackList;
