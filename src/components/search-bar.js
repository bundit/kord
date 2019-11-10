import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/library.module.css";

const SearchBar = ({ query, onChange, onSubmit }) => (
  // <div className={styles.searchBarWrapper}>
  <>
    <form onSubmit={onSubmit} action="">
      <input
        className={styles.searchBar}
        name="search"
        type="search"
        onChange={onChange}
        placeholder="Search for Music"
        value={query}
      />
    </form>
    <FontAwesomeIcon className={styles.searchIcon} icon={faSearch} />
    {/* eslint-disable-next-line react/button-has-type */}
    <button className={styles.xButton} type="reset">
      <FontAwesomeIcon icon={faTimesCircle} />
    </button>
  </>
);

SearchBar.propTypes = {
  query: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

SearchBar.defaultProps = {
  query: ""
};

export default SearchBar;
