import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/library.module.css";

const SearchBar = ({ placeholder, query, onChange, onSubmit, onReset }) => (
  <>
    <form className={styles.searchForm} onSubmit={onSubmit} action="">
      <input
        className={styles.searchBar}
        name="search"
        type="search"
        onChange={onChange}
        placeholder={placeholder}
        value={query}
        // disable auto inputs
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
      />
    </form>
    <FontAwesomeIcon className={styles.searchIcon} icon={faSearch} />
    {/* eslint-disable-next-line react/button-has-type */}
    <button className={styles.xButton} type="reset" onClick={onReset}>
      <FontAwesomeIcon icon={faTimesCircle} />
    </button>
  </>
);

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
