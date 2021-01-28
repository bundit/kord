import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useLocation, useParams } from "react-router-dom";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { forceCheck } from "react-lazyload";
import { useSelector } from "react-redux";
import React, { useState, useEffect } from "react";
import queryString from "query-string";

import { SOURCES } from "../utils/constants";
import { SourceSearchButton } from "./buttons";
import { cacheValue, loadCachedValue } from "../utils/sessionStorage";
import ArtistList from "./artist-list";
import SearchTrackList from "./search-track-list";
import styles from "../styles/search-results-page.module.scss";

const SearchResultsPage = () => {
  const [sourcesToSearch, setSourcesToSearch] = useState([]);
  const results = useSelector(state => state.search);

  const { query } = useParams();
  const { search } = useLocation();
  const { restored } = queryString.parse(search);

  useCacheSearchResults(query, sourcesToSearch, setSourcesToSearch);

  function handleShowSearch(sourceToSearch) {
    const updatedSources = [...sourcesToSearch, sourceToSearch];
    setSourcesToSearch(updatedSources);
  }

  function handleHideSearch(sourceToHide) {
    const updatedSources = sourcesToSearch.filter(
      source => source !== sourceToHide
    );
    setSourcesToSearch(updatedSources);
  }

  return (
    <div onScroll={forceCheck} className={styles.pageWrapper}>
      <h3 className={styles.showingResultsTitle}>
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
        <SearchButtonList
          searchSourceList={sourcesToSearch}
          hideSearch={handleHideSearch}
          showSearch={handleShowSearch}
        />
      </div>
      <SearchArtistResults
        searchSourceList={sourcesToSearch}
        searchResults={results}
      />
      <SearchTrackResults
        searchSourceList={sourcesToSearch}
        query={query}
        searchResults={results}
        isRestoredPage={restored}
      />
    </div>
  );
};

function useCacheSearchResults(query, sourcesToSearch, setSourcesToSearch) {
  const mainSource = useSelector(state => state.user.kord.mainConnection);

  useEffect(() => {
    let cachedSourceSearches = loadCachedValue(`Search:sources:${query}`);
    setSourcesToSearch(cachedSourceSearches || [mainSource]);
  }, [query, mainSource, setSourcesToSearch]);

  useEffect(() => {
    cacheValue(`Search:sources:${query}`, sourcesToSearch);
  }, [query, sourcesToSearch]);
}

function SearchButtonList({ searchSourceList, hideSearch, showSearch }) {
  const user = useSelector(state => state.user);
  const connectedSources = SOURCES.filter(source => user[source].isConnected);

  return SOURCES.map(source => {
    function handleSearchButtonClick(e) {
      if (searchSourceList.includes(source)) {
        hideSearch(source);
      } else {
        showSearch(source);
      }
    }
    return (
      <SourceSearchButton
        key={`Search:button:${source}`}
        source={source}
        onClick={handleSearchButtonClick}
        disabled={!connectedSources.includes(source)}
        isSearched={searchSourceList.includes(source)}
      />
    );
  });
}

function SearchArtistResults({ searchSourceList, searchResults }) {
  const sourcesThatHaveResults = searchSourceList.filter(
    source =>
      searchResults[source] &&
      searchResults[source].artists &&
      searchResults[source].artists.length
  );

  return (
    !!sourcesThatHaveResults.length && (
      <div className={styles.artistList}>
        {sourcesThatHaveResults.map(source => (
          <ArtistList
            key={`Artist:List:${source}`}
            source={source}
            artists={searchResults[source] ? searchResults[source].artists : []}
          />
        ))}
      </div>
    )
  );
}

function SearchTrackResults({
  searchSourceList,
  query,
  searchResults,
  isRestoredPage
}) {
  return (
    <div className={styles.searchTrackListGridLayout}>
      {searchSourceList.map(source => (
        <SearchTrackList
          source={source}
          query={query}
          tracks={
            searchResults[source] ? searchResults[source].tracks : { list: [] }
          }
          key={`Search:${source}:${query}`}
          restored={isRestoredPage}
        />
      ))}
    </div>
  );
}

export default SearchResultsPage;
