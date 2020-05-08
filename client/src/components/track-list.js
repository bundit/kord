import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import React from "react";

import { playTrack } from "../redux/actions/playerActions";
import TrackItem from "./track-item";

const TrackList = ({ search, tracks, currentTrackID, isPlaying }) => {
  const queueIndex = useSelector(state => state.player.index);
  const dispatch = useDispatch();

  function dispatchPlayTrack(index) {
    dispatch(playTrack(index, tracks));
  }

  return (
    tracks &&
    tracks.map((track, i) => (
      <TrackItem
        key={`${search ? "Search" : "Lib"}:${track.source}:${track.id}:${i}`}
        track={track}
        handlePlay={dispatchPlayTrack}
        isActive={currentTrackID === track.id && i === queueIndex}
        isPlaying={isPlaying}
        index={i}
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
