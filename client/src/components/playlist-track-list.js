import { connect } from "react-redux";
import React, { useState, useEffect } from "react";

import { getSpotifyPlaylistTracks } from "../redux/actions/spotifyActions";
import TrackList from "./track-list";

const PlaylistTracklist = ({
  source,
  id,
  isPlaying,
  playlists,
  handlePlay,
  currentTrackID,
  dispatchLoadMoreTracks
}) => {
  const [currentPlaylist, setCurrentPlaylist] = useState({
    id: 0,
    next: null,
    tracks: []
  });

  useEffect(() => {
    // Casting needed sometimes
    // eslint-disable-next-line
    const playlistIndex = playlists[source].findIndex(p => p.id == id);
    const thePlaylist = playlists[source][playlistIndex];
    setCurrentPlaylist(thePlaylist);
  }, [id, playlists, source]);

  const tracks = currentPlaylist ? currentPlaylist.tracks : [];

  return (
    <TrackList
      songs={tracks}
      handlePlay={handlePlay}
      currentTrackID={currentTrackID}
      isPlaying={isPlaying}
      loadMoreTracks={() =>
        dispatchLoadMoreTracks(source, id, currentPlaylist.next)
      }
    />
  );
};

const loadMoreTracks = (source, id, next) => dispatch => {
  if (source === "spotify") {
    return dispatch(getSpotifyPlaylistTracks(id, next));
  }
};

const mapDispatchToProps = dispatch => ({
  dispatchLoadMoreTracks: (source, id, next) =>
    dispatch(loadMoreTracks(source, id, next))
});

export default connect(
  null,
  mapDispatchToProps
)(PlaylistTracklist);
