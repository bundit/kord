import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import React from "react";

import TrackItem from "./track-item";

const TrackList = ({
  tracks,
  handlePlay,
  playlistId,
  isFromSearch,
  isFromQueue,
  handleRemoveTrack
}) => {
  const queueIndex = useSelector(state => state.player.index);
  const playingContext = useSelector(state => state.player.context);
  const currentTrackId = useSelector(state => state.player.currentTrack.id);

  return (
    tracks &&
    tracks.map((track, i) => (
      <TrackItem
        key={`${isFromSearch ? "Search" : "Lib"}:${track.source}:${
          track.id
        }:${i}`}
        track={track}
        isActive={
          currentTrackId === track.id &&
          playingContext.id === playlistId &&
          (isFromSearch || i === queueIndex)
        }
        index={i}
        handlePlay={handlePlay}
        playlistId={playlistId}
        isFromSearch={isFromSearch}
        isFromQueue={isFromQueue}
        handleRemove={handleRemoveTrack}
      />
    ))
  );
};

TrackList.propTypes = {
  tracks: PropTypes.arrayOf(PropTypes.object),
  handlePlay: PropTypes.func.isRequired,
  playlistId: PropTypes.string,
  isFromSearch: PropTypes.bool,
  isFromQueue: PropTypes.bool,
  handleRemoveTrack: PropTypes.func
};

TrackList.defaultProps = {
  tracks: [],
  isFromSearch: false,
  isFromQueue: false,
  handleRemoveTrack: null,
  playlistId: ""
};

export default TrackList;
