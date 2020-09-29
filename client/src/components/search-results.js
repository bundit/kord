import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useLocation, useParams } from "react-router-dom";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import {
  faSoundcloud,
  faSpotify,
  faYoutube,
  faMixcloud
} from "@fortawesome/free-brands-svg-icons";
import { forceCheck } from "react-lazyload";
import { useDispatch, useSelector } from "react-redux";
import React, { useState, useEffect } from "react";
import queryString from "query-string";

import { cacheValue, loadCachedValue } from "../utils/sessionStorage";
import { capitalizeWord } from "../utils/formattingHelpers";
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

  function handleSearchSource(e) {
    const updatedSources = [...sourcesToSearch, e.target.value];
    setSourcesToSearch(updatedSources);
  }

  function handleHideSearch(e) {
    const updatedSources = sourcesToSearch.filter(
      source => source !== e.target.value
    );
    setSourcesToSearch(updatedSources);
  }

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
        {allSources.map(source => (
          <button
            className={sourceButtons[source].className}
            key={`Search:button:${source}`}
            value={source}
            onClick={
              sourcesToSearch.includes(source)
                ? handleHideSearch
                : handleSearchSource
            }
            disabled={!connectedSources.includes(source)}
          >
            <FontAwesomeIcon
              icon={sourceButtons[source].icon}
              style={{
                color: sourcesToSearch.includes(source)
                  ? sourceButtons[source].color
                  : null
              }}
            />
            {sourcesToSearch.includes(source) ? ` Hide` : ` Show`}{" "}
            {capitalizeWord(source)}
          </button>
        ))}
      </div>
      <div className={styles.pageWrapper} style={{ margin: 0 }}>
        {resultsComponents}
      </div>
    </div>
  );
};

const sourceButtons = {
  spotify: {
    className: styles.searchSpotifyButton,
    icon: faSpotify,
    color: "#1db954b3"
  },
  soundcloud: {
    className: styles.searchSoundcloudButton,
    icon: faSoundcloud,
    color: "#ff5500b3"
  },
  youtube: {
    className: styles.searchYoutubeButton,
    icon: faYoutube,
    color: "#ff0000b3"
  },

  mixcloud: {
    className: styles.searchMixcloudButton,
    icon: faMixcloud,
    color: "#5000ffcc"
  }
};

export default SearchResults;
