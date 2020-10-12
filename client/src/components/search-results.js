import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useLocation, useParams } from "react-router-dom";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { forceCheck } from "react-lazyload";
import { useDispatch, useSelector } from "react-redux";
import React, { useState, useEffect } from "react";
import queryString from "query-string";

import { COLORS, ICONS } from "../utils/constants";
import { SourceSearchButton } from "./buttons";
import { cacheValue, loadCachedValue } from "../utils/sessionStorage";
import { capitalizeWord } from "../utils/formattingHelpers";
import ArtistList from "./artist-list";
import SearchTrackList from "./search-track-list";
import styles from "../styles/library.module.css";

const SearchResults = () => {
  const [sourcesToSearch, setSourcesToSearch] = useState([]);
  const currentTrackId = useSelector(state => state.player.currentTrack.id);
  const mainSource = useSelector(state => state.user.kord.mainConnection);
  const isPlaying = useSelector(state => state.player.isPlaying);
  const results = useSelector(state => state.search);
  const user = useSelector(state => state.user);

  const { query } = useParams();
  const { search } = useLocation();
  const { restored } = queryString.parse(search);
  const dispatch = useDispatch();
  const allSources = ["spotify", "soundcloud", "youtube", "mixcloud"];
  const connectedSources = allSources.filter(
    source => user[source].isConnected
  );

  useEffect(() => {
    let cachedSourceSearches = loadCachedValue(`Search:sources:${query}`);
    setSourcesToSearch(cachedSourceSearches || [mainSource]);
  }, [query, dispatch, mainSource]);

  useEffect(() => {
    cacheValue(`Search:sources:${query}`, sourcesToSearch);
  }, [query, sourcesToSearch]);

  function handleSearchSource(sourceToSearch) {
    const updatedSources = [...sourcesToSearch, sourceToSearch];
    setSourcesToSearch(updatedSources);
  }

  function handleHideSearch(sourceToHide) {
    const updatedSources = sourcesToSearch.filter(
      source => source !== sourceToHide
    );
    setSourcesToSearch(updatedSources);
  }

  const artistComponents = sourcesToSearch.map(source => (
    <ArtistList
      key={`Artist:List:${source}`}
      source={source}
      artists={results[source] ? results[source].artists : []}
    />
  ));

  const resultsComponents = sourcesToSearch.map(source => (
    <SearchTrackList
      source={source}
      query={query}
      tracks={results[source] ? results[source].tracks : { list: [] }}
      currentTrackId={currentTrackId}
      isPlaying={isPlaying}
      key={`Search:${source}:${query}`}
      restored={restored}
    />
  ));

  return (
    <div
      onScroll={forceCheck}
      style={{ overflowY: "scroll", margin: "80px 0" }}
    >
      <h3
        className={styles.listTitle}
        style={{ color: "#aaa", fontSize: "20px" }}
      >
        {`Showing search results for "${query}" `}
        <br />
        <span>
          <Link to="/app/search" className={styles.returnToSearchButton}>
            <FontAwesomeIcon icon={faArrowLeft} />
            {" Return to search page"}
          </Link>
        </span>
      </h3>
      <div className={styles.searchButtonsWrapper}>
        {allSources.map(source => {
          function handleSearchButtonClick(e) {
            if (sourcesToSearch.includes(source)) {
              handleHideSearch(source);
            } else {
              handleSearchSource(source);
            }
          }
          return (
            <SourceSearchButton
              key={`Search:button:${source}`}
              source={source}
              onClick={handleSearchButtonClick}
              disabled={!connectedSources.includes(source)}
            >
              <FontAwesomeIcon
                icon={ICONS[source]}
                style={{
                  color: sourcesToSearch.includes(source)
                    ? COLORS[source]
                    : null
                }}
              />
              {sourcesToSearch.includes(source) ? ` Hide` : ` Show`}{" "}
              {capitalizeWord(source)}
            </SourceSearchButton>
          );
        })}
      </div>
      <div
        className={`${styles.libraryWrapper} ${styles.playlistList}`}
        style={{ marginTop: "50px" }}
      >
        {artistComponents}
      </div>
      <div className={styles.pageWrapper} style={{ margin: 0 }}>
        {resultsComponents}
      </div>
    </div>
  );
};

export default SearchResults;
