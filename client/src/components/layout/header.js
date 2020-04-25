import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink, useHistory } from "react-router-dom";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import React from "react";

import { searchMusic, setQuery } from "../../redux/actions/searchActions";
import SearchBar from "../search-bar";
import styles from "../../styles/header.module.css";

function Header({ location }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const { pathname } = location;
  const baseUrls = ["Library", "Search", "More", ""];

  const query = useSelector(state => state.search.query);

  function handleSearchChange(e) {
    dispatch(setQuery(e.target.value));
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    // TODO

    dispatch(searchMusic(query));
  }

  function handleResetQuery() {
    dispatch(setQuery(""));
  }

  function handleGoBack() {
    history.goBack();
  }

  function handleGoForward() {
    history.goForward();
  }

  // Get only last route
  let title = pathname.slice(pathname.lastIndexOf("/") + 1);
  // Make it capitalized
  if (title.length > 0) {
    title = `${title[0].toUpperCase()}${title.slice(1)}`;
  }
  // Previous route within tab
  const prevRoute = pathname.slice(0, pathname.lastIndexOf("/"));

  return (
    <>
      <header className={styles.header}>
        <div className={styles.mobileContainer}>
          <div className={styles.placeholder}>
            {!baseUrls.includes(title) && (
              <NavLink
                style={{ color: "red", marginLeft: "0.3rem" }}
                to={`${prevRoute}`}
              >
                <FontAwesomeIcon icon={faAngleLeft} size="3x" />
              </NavLink>
            )}
          </div>

          <h1>{title.length ? title : "kord"}</h1>

          <div className={styles.placeholder} />
        </div>
      </header>

      {/* Desktop Header */}
      <header className={styles.deskHeader}>
        <div className={styles.deskHeaderContainer}>
          <div className={styles.navGroup}>
            <button type="button" onClick={handleGoBack}>
              <FontAwesomeIcon size="lg" icon={faAngleLeft} />
            </button>
            <button
              disabed={window.history.next}
              type="button"
              onClick={handleGoForward}
            >
              <FontAwesomeIcon size="lg" icon={faAngleRight} />
            </button>
          </div>
          <SearchBar
            placeholder="Search for Music"
            query={query}
            onChange={handleSearchChange}
            onSubmit={handleSearchSubmit}
            onReset={handleResetQuery}
          />
          {/* <div className={styles.settingIconContainer}>
            <button type="button" onClick={() => history.push("/settings")}>
              <FontAwesomeIcon size="3x" icon={faCogs} />
            </button>
          </div> */}
        </div>
      </header>
    </>
  );
}

Header.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  }).isRequired
};

export default Header;
