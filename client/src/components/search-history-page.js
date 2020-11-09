import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";

import { ShowMoreResultsButton as StartSearchButton } from "./buttons";
import {
  addToSearchHistory,
  removeFromSearchHistory
} from "../redux/actions/searchActions";
import SearchBar from "./search-bar";
import styles from "../styles/search-history-page.module.scss";

const SearchHistoryPage = () => {
  const searchHistory = useSelector(state => state.search.history) || [];

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.mobileSearchbarWrapper}>
        <SearchBar placeholder="Search for Music" />
      </div>
      <div className={styles.pageSectionWrapper}>
        <h2 className={styles.recentSearchesTitle}>Your Recent Searches</h2>
        {searchHistory.length ? (
          <SearchHistoryList searchHistory={searchHistory} />
        ) : (
          <EmptySearchHistoryPlaceholder />
        )}
      </div>
    </div>
  );
};

function SearchHistoryList({ searchHistory }) {
  const dispatch = useDispatch();

  function handleDeleteSearch(e) {
    dispatch(removeFromSearchHistory(e.currentTarget.value));
  }

  function handleRedoSearch(e) {
    const pastQuery = e.target.innerText.replace(/"|\n/g, "").trim();
    dispatch(addToSearchHistory(pastQuery));
  }

  return (
    <div className={`${styles.searchHistoryList}`}>
      {searchHistory.map(searchPhrase => (
        <div
          className={styles.searchHistoryItemWrapper}
          key={`Phrase:${searchPhrase}`}
        >
          <Link
            to={`/app/search/${searchPhrase}`}
            className={styles.searchHistoryItem}
            onClick={handleRedoSearch}
            key={`Phrase:${searchPhrase}`}
          >
            <div>
              <br />
              {`"${searchPhrase}"`}
            </div>
          </Link>
          <button
            className={styles.deleteSearchButton}
            onClick={handleDeleteSearch}
            value={searchPhrase}
          >
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>
      ))}
    </div>
  );
}

function EmptySearchHistoryPlaceholder() {
  const [searchBarIsFocused, setSearchBarIsFocused] = useState(false);

  useEffect(() => {
    function onBlur(e) {
      setSearchBarIsFocused(false);
      e.target.removeEventListener("blur", onBlur);
    }

    if (searchBarIsFocused) {
      const searchBar = document.getElementById("search-bar");

      searchBar.addEventListener("blur", onBlur);
      setSearchBarIsFocused(searchBar === document.activeElement);
    }
  }, [searchBarIsFocused]);

  function handleSearchBarFocus(e) {
    const searchBar = document.getElementById("search-bar");

    e.target.blur();
    searchBar.focus();
    setSearchBarIsFocused(true);
  }

  return (
    <div className={styles.emptySearchHistoryWrapper}>
      <div>Start searching and your history will show up here</div>

      <StartSearchButton
        onClick={handleSearchBarFocus}
        style={{
          marginTop: "100px",
          visibility: searchBarIsFocused && "hidden"
        }}
      >
        Start Your Search
      </StartSearchButton>
    </div>
  );
}

export default SearchHistoryPage;
