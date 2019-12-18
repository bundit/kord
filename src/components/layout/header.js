import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";

import styles from "../../styles/header.module.css";

function Header({ location, history }) {
  const { pathname } = location;
  const baseUrls = ["Library", "Search", "More"];

  // Get only last route
  let title = pathname.slice(pathname.lastIndexOf("/") + 1);

  // Make it capitalized
  if (title.length > 0) {
    title = `${title[0].toUpperCase()}${title.slice(1)}`;
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.placeholder}>
          {!baseUrls.includes(title) && (
            <button type="button" onClick={() => history.goBack()}>
              <FontAwesomeIcon icon={faAngleLeft} size="3x" />
            </button>
          )}
        </div>

        <h1>{title}</h1>

        <div className={styles.placeholder} />
      </div>
    </header>
  );
}

Header.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  }).isRequired,
  history: PropTypes.shape({
    goBack: PropTypes.func
  }).isRequired
};

export default Header;
