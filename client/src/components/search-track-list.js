import { useDispatch } from "react-redux";
import React from "react";

import { capitalizeWord } from "../utils/capitalizeWord";
import { loadMoreSoundcloudTracks } from "../redux/actions/soundcloudActions";
import { loadMoreSpotifyTracks } from "../redux/actions/spotifyActions";
import TrackList from "./track-list";
import styles from "../styles/library.module.css";

const SearchTrackList = ({ source, tracks, currentTrackId, isPlaying }) => {
  const dispatch = useDispatch();

  function handleLoadMoreTracks() {
    if (tracks.next) {
      dispatch(loadMoreTracks(source, tracks.next));
    }
  }

  return (
    <div className={styles.searchListContainer}>
      <h2 className={styles.searchTitle} key={`Search:Title:${source}`}>
        {capitalizeWord(source)}
      </h2>
      <TrackList
        search
        hasNext={tracks.next}
        songs={tracks.list}
        currentTrackID={currentTrackId}
        isPlaying={isPlaying}
        loadMoreTracks={handleLoadMoreTracks}
      />
    </div>
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
