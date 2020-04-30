import { useDispatch } from "react-redux";
import React from "react";

import { loadMoreSoundcloudTracks } from "../redux/actions/soundcloudActions";
import { loadMoreSpotifyTracks } from "../redux/actions/spotifyActions";
import TrackList from "./track-list";

const SearchTrackList = ({ source, tracks, currentTrackId, isPlaying }) => {
  const dispatch = useDispatch();

  function handleLoadMoreTracks() {
    if (tracks.next) {
      dispatch(loadMoreTracks(source, tracks.next));
    }
  }

  return (
    <TrackList
      search
      title={source}
      hasNext={tracks.next}
      songs={tracks.list}
      currentTrackID={currentTrackId}
      isPlaying={isPlaying}
      loadMoreTracks={handleLoadMoreTracks}
    />
  );
};

const loadMoreTracks = (source, next) => dispatch => {
  if (!next) return;

  if (source === "soundcloud") {
    dispatch(loadMoreSoundcloudTracks(next));
  } else if (source === "spotify") {
    dispatch(loadMoreSpotifyTracks(next));
  }
};

export default SearchTrackList;
