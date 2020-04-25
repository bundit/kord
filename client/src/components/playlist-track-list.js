import { useDispatch } from "react-redux";
import React from "react";

import { getSoundcloudLikes } from "../redux/actions/soundcloudActions";
import { getSpotifyPlaylistTracks } from "../redux/actions/spotifyActions";
import TrackList from "./track-list";

const PlaylistTracklist = ({
  source,
  id,
  isPlaying,
  playlists,
  handlePlay,
  currentTrackID
}) => {
  const dispatch = useDispatch();
  // eslint-disable-next-line
  const playlistIndex = playlists[source].findIndex(p => p.id == id);
  const currentPlaylist = playlists[source][playlistIndex];

  const tracks = currentPlaylist ? currentPlaylist.tracks : [];

  function handleLoadMoreTracks() {
    dispatch(
      loadMoreTracks(source, id, currentPlaylist && currentPlaylist.next)
    );
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
  if (!next) {
    return;
  }

  if (source === "spotify") {
    return dispatch(getSpotifyPlaylistTracks(id, next));
  } else if (source === "soundcloud" && id === "likes") {
    return dispatch(getSoundcloudLikes(next));
  }
};

export default PlaylistTracklist;
