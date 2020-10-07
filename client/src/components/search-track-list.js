import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { useAlert } from "react-alert";
import { useDispatch } from "react-redux";
import React, { useState, useEffect } from "react";

import { cacheValue, loadCachedValue } from "../utils/sessionStorage";
import { capitalizeWord } from "../utils/formattingHelpers";
import {
  loadMoreTrackResults,
  searchForMusic
} from "../redux/actions/searchActions";
import { playTrack } from "../redux/actions/playerActions";
import LoadingSpinner from "./loading-spinner";
import TrackList from "./track-list";
import styles from "../styles/library.module.css";

const searchIncrementAmount = 10;

const SearchTrackList = ({
  source,
  tracks,
  query,
  currentTrackId,
  isPlaying,
  restored
}) => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const [isLoading, setIsLoading] = useState(restored ? false : true);
  const [numShowTracks, setNumShowTracks] = useState(restored ? 10 : 0);
  const searchHasMoreToShow =
    (tracks && tracks.next) || numShowTracks < tracks.list.length;
  const listHeight = Math.min(tracks.list.length, numShowTracks);

  useEffect(() => {
    const numTracks = loadCachedValue(`Search:${query}:${source}:numTracks`);
    const search = dispatch(searchForMusic(source, query));

    if (numTracks) {
      search.then(() => {
        setNumShowTracks(numTracks);
        setIsLoading(false);
      });
    } else {
      search
        .catch(e => {
          alert.error(`Error searching "${query}" from ${source}`);
        })
        .finally(handleShowMore);
    }

    // eslint-disable-next-line
  }, [query, source]);

  useEffect(() => {
    cacheValue(`Search:${query}:${source}:numTracks`, numShowTracks);
  }, [numShowTracks, query, source]);

  function handleShowMore() {
    setIsLoading(true);

    let loadTracks;
    if (numShowTracks >= tracks.list.length) {
      loadTracks = handleLoadMoreTracks();
    } else loadTracks = Promise.resolve();

    loadTracks
      .catch(e => {
        alert.error(`Error loading tracks from ${source}`);
      })
      .finally(() =>
        setTimeout(() => {
          setIsLoading(false);
          setNumShowTracks(numShowTracks + searchIncrementAmount);
        }, 500)
      );
  }

  function handleLoadMoreTracks() {
    if (tracks.next) {
      return dispatch(loadMoreTrackResults(source, tracks.next));
    } else return Promise.resolve();
  }

  function dispatchPlayTrack(index) {
    const context = {
      source: tracks.list[index].source,
      id: "search",
      title: capitalizeWord(query)
    };
    dispatch(playTrack(index, tracks.list, tracks.next, context));
  }

  return (
    <div className={styles.listContainer}>
      <h2 className={styles.listTitle}>{capitalizeWord(source) + " Tracks"}</h2>
      <div
        className={`${styles.libraryWrapper}`}
        style={{
          height: `${65 * listHeight}px`,
          overflowY: "hidden"
        }}
      >
        <TrackList
          search
          tracks={tracks.list.slice(0, numShowTracks)}
          currentTrackID={currentTrackId}
          isPlaying={isPlaying}
          handlePlay={dispatchPlayTrack}
          playlistId="search"
        />
      </div>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <button
          type="button"
          onClick={handleShowMore}
          className={
            searchHasMoreToShow ? styles.showMoreButton : styles.endOfResults
          }
        >
          {searchHasMoreToShow ? (
            <>
              {"Show More "}
              <FontAwesomeIcon icon={faAngleDown} />
            </>
          ) : (
            "End of results"
          )}
        </button>
      )}
    </div>
  );
};

export default SearchTrackList;
