import { SubmitButton } from "./buttons";

import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import {
  addToSearchHistory,
  fetchAutoCompleteResults,
  removeFromSearchHistory,
  setAutoCompleteResults,
  setQuery
} from "../redux/actions/searchActions";
import styles from "../styles/searchForm.module.css";

const SearchBar = ({ placeholder }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const prevEnteredQuery = useRef(null);
  const completionIndex = useRef(-1);
  const searchBarRef = useRef(null);
  const searchTimer = useRef(null);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const searchHistory = useSelector((state) => state.search.history);
  const query = useSelector((state) => state.search.query) || "";
  const autoCompleteResults =
    useSelector((state) => state.search.autoCompleteResults) || [];

  const allCompleteResults = getAllCompleteResults();
  const searchCompletionComponents = allCompleteResults.map((aQuery, i) => (
    <SearchCompletion
      query={aQuery}
      isHistory={i < filteredHistory.length}
      key={`${aQuery}:${i < filteredHistory.length ? "history" : "suggestion"}`}
      onClick={handleQueryClick}
      handleRemove={handleRemoveQuery}
      isSelected={i === completionIndex.current}
    />
  ));

  function getAllCompleteResults() {
    const MAX_SEARCH_RESULTS = 10;
    const fullList = [...filteredHistory, ...autoCompleteResults];

    return fullList.slice(0, MAX_SEARCH_RESULTS);
  }

  function updateFilteredHistory() {
    setFilteredHistory(
      searchHistory.filter((pastQuery) => !query || pastQuery.includes(query))
    );
  }

  function handleSearchBarOnClick() {
    // Reset dropdown index
    completionIndex.current = -1;
    updateFilteredHistory();

    // New query, fetch new results
    if (query !== prevEnteredQuery.current) {
      dispatch(fetchAutoCompleteResults(query));
      prevEnteredQuery.current = query;
    }
  }

  function handleSearchChange(e) {
    const newQuery = e.target.value;

    dispatch(setQuery(newQuery));

    if (searchTimer.current) {
      clearTimeout(searchTimer.current);
    }

    if (newQuery) {
      searchTimer.current = setTimeout(
        () => dispatch(fetchAutoCompleteResults(newQuery)),
        200
      );
    } else {
      setFilteredHistory(searchHistory);
      dispatch(setAutoCompleteResults([]));
    }
  }

  function handleSearchSubmit(e) {
    if (query.length) {
      navigate(`/app/search/${encodeURIComponent(query)}`);
      dispatch(addToSearchHistory(query));
    }

    searchBarRef.current.blur();

    e.preventDefault();
  }

  function handleKeyUp(e) {
    const { keyCode } = e;

    if (keyCode !== 38 && keyCode !== 40) {
      prevEnteredQuery.current = query;
      updateFilteredHistory();
    }
  }

  function handleKeyDown(e) {
    const { keyCode } = e;

    if (keyCode !== 38 && keyCode !== 40) {
      e.stopPropagation();
      return;
    }

    const currIndex = completionIndex.current;
    const dropdownListLength = searchCompletionComponents.length;
    let newDropdownIndex;

    if (keyCode === 38) {
      if (currIndex === -1) {
        newDropdownIndex = dropdownListLength - 1;
      } else {
        newDropdownIndex = currIndex - 1;
      }
    } else if (keyCode === 40) {
      if (currIndex >= dropdownListLength - 1) {
        newDropdownIndex = -1;
      } else {
        newDropdownIndex = currIndex + 1;
      }
    }

    completionIndex.current = newDropdownIndex;

    if (newDropdownIndex === -1) {
      dispatch(setQuery(prevEnteredQuery.current));
    } else {
      dispatch(setQuery(allCompleteResults[newDropdownIndex]));
    }

    e.preventDefault();
    e.stopPropagation();
  }

  function handleQueryClick(e) {
    const queryValue = e.target.getAttribute("query-value");
    dispatch(setQuery(queryValue));
    dispatch(addToSearchHistory(queryValue));

    e.target.blur();
  }

  function handleRemoveQuery(e, query) {
    dispatch(removeFromSearchHistory(query));

    setFilteredHistory(
      filteredHistory.filter((prevQuery) => prevQuery !== query)
    );

    if (searchBarRef.current) {
      searchBarRef.current.focus();
    }
  }

  return (
    <form
      className={styles.searchForm}
      onSubmit={handleSearchSubmit}
      action=""
      style={{ position: "relative" }}
    >
      <input
        className={`${styles.searchBar} ${
          query.length && styles.searchBarHasValue
        }`}
        ref={searchBarRef}
        id="search-bar"
        name="search"
        type="search"
        onClick={handleSearchBarOnClick}
        onChange={handleSearchChange}
        onKeyUp={handleKeyUp}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        value={query}
        // disable auto inputs
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
      />
      <div className={styles.searchButtonContainer}>
        <SubmitButton
          className={`${styles.submitSearchButton} ${
            query.length && styles.visibleButton
          }`}
        >
          Search
        </SubmitButton>
      </div>
      {searchCompletionComponents && searchCompletionComponents.length ? (
        <div className={styles.searchCompletionWrapper}>
          {searchCompletionComponents}
        </div>
      ) : null}
    </form>
  );
};

function SearchCompletion({
  query,
  isHistory,
  onClick,
  handleRemove,
  isSelected
}) {
  return (
    <div
      className={`${styles.searchCompleteItem} ${
        isSelected && styles.selectedItem
      }`}
    >
      <Link
        to={`/app/search/${encodeURIComponent(query)}`}
        onClick={onClick}
        query-value={query}
      >
        {query}
      </Link>
      {isHistory && (
        <button type="button" onClick={(e) => handleRemove(e, query)}>
          <FontAwesomeIcon icon={faTimes} size="sm" />
        </button>
      )}
    </div>
  );
}

SearchBar.propTypes = {
  placeholder: PropTypes.string
};

SearchBar.defaultProps = {
  placeholder: "Search"
};

export default SearchBar;
