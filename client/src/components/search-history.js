import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import React from "react";

import { removeFromSearchHistory } from "../redux/actions/searchActions";
import styles from "../styles/library.module.css";

const SearchHistory = () => {
  const searchHistory = useSelector(state => state.search.history) || [];
  const dispatch = useDispatch();
  const [searchBarIsFocused, setSearchBarIsFocused] = React.useState(false);

  React.useEffect(() => {
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

  function handleDeleteSearch(e) {
    dispatch(removeFromSearchHistory(e.currentTarget.value));
  }

  function handleSearchBarFocus(e) {
    const searchBar = document.getElementById("search-bar");

    e.target.blur();
    searchBar.focus();
    setSearchBarIsFocused(true);
  }

  return (
    <div
      className={styles.pageWrapper}
      style={{ display: "flex", flexDirection: "column" }}
    >
      <h2 className={styles.listTitle} style={{ marginTop: "40px" }}>
        Your Recent Searches
      </h2>

      {searchHistory.length ? (
        <div className={`${styles.libraryWrapper} ${styles.playlistList}`}>
          {searchHistory.map(searchPhrase => (
            <div
              style={{
                position: "relative",
                color: "#ccc",
                alignItems: "center"
              }}
              key={`Phrase:${searchPhrase}`}
            >
              <Link
                to={`/app/search/${searchPhrase}`}
                className={`${styles.playlistItem} ${styles.redoSearchLink}`}
              >
                <span style={{ marginTop: "auto", display: "block" }}>
                  <br />
                  {`"${searchPhrase}"`}
                </span>
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
      ) : (
        <div
          style={{
            margin: "0 auto",
            marginTop: "50px",
            color: "#777",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <div>Start searching and your history will show up here</div>
          {searchBarIsFocused ? null : (
            <button
              type="button"
              className={styles.showMoreButton}
              onClick={handleSearchBarFocus}
              style={{ marginTop: "100px" }}
            >
              Start Your Search
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchHistory;
