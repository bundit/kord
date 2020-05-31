import PropTypes from "prop-types";
import React from "react";

import styles from "../styles/searchForm.module.css";

const SearchBar = ({ placeholder, query, onChange, onSubmit, onReset }) => (
  <form className={styles.searchForm} onSubmit={onSubmit} action="">
    <input
      className={`${styles.searchBar} ${query.length &&
        styles.searchBarHasValue}`}
      id="search-bar"
      name="search"
      type="search"
      onChange={onChange}
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
      <button
        type="submit"
        className={`${styles.submitSearchButton} ${query.length &&
          styles.visibleButton}`}
      >
        Search
      </button>
    </div>
  </form>
);

function handleKeyDown(e) {
  // Don't trigger play pause with spacebar
  e.stopPropagation();
}

SearchBar.propTypes = {
  query: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  onReset: PropTypes.func.isRequired
};

SearchBar.defaultProps = {
  query: "",
  placeholder: "Search"
};

export default SearchBar;
