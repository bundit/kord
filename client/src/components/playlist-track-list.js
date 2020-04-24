import { connect } from "react-redux";
import React from "react";

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
  // eslint-disable-next-line
  const playlistIndex = playlists[source].findIndex(p => p.id == id);
  const currentPlaylist = playlists[source][playlistIndex];

  const tracks = currentPlaylist ? currentPlaylist.tracks : [];

  function handleLoadMoreTracks() {
    dispatchLoadMoreTracks(source, id, currentPlaylist.next);
  }

  return (
    <TrackList
      trackListId={id}
      songs={tracks}
      handlePlay={handlePlay}
      currentTrackID={currentTrackID}
      isPlaying={isPlaying}
      loadMoreTracks={handleLoadMoreTracks}
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
