import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import React, { useState } from "react";

import { capitalizeWord } from "../utils/capitalizeWord";
import { loadMoreSoundcloudTracks } from "../redux/actions/soundcloudActions";
import { loadMoreSpotifyTracks } from "../redux/actions/spotifyActions";
import TrackList from "./track-list";
import styles from "../styles/library.module.css";

const searchIncrementAmount = 5;

const SearchTrackList = ({ source, tracks, currentTrackId, isPlaying }) => {
  const dispatch = useDispatch();
  const [numShowTracks, setNumShowTracks] = useState(searchIncrementAmount);
  const searchHasMoreToShow = tracks.next || numShowTracks < tracks.length;
  const listHeight = Math.min(tracks.list.length, numShowTracks);

  function handleLoadMoreTracks() {
    if (tracks.next) {
      dispatch(loadMoreTracks(source, tracks.next));
    }
  }

  function handleShowMore() {
    if (numShowTracks >= tracks.list.length) {
      handleLoadMoreTracks();
    }

    setNumShowTracks(numShowTracks + searchIncrementAmount);
  }

  return (
    <div className={styles.listContainer}>
      <h2 className={styles.listTitle}>{capitalizeWord(source)}</h2>
      <div
        className={`${styles.libraryWrapper}`}
        style={{
          height: `${65 * listHeight}px`
          // overflowY: "hidden"
        }}
      >
        <TrackList
          search
          tracks={tracks.list.slice(0, numShowTracks)}
          currentTrackID={currentTrackId}
          isPlaying={isPlaying}
        />
      </div>
      {searchHasMoreToShow && (
        <button
          type="button"
          onClick={handleShowMore}
          className={styles.showMoreButton}
        >
          {"Show More "}
          <FontAwesomeIcon icon={faAngleDown} />
        </button>
      )}
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
