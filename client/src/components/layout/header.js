import React from "react";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";

import styles from "../../styles/header.module.css";

function Header({ location }) {
  const { pathname } = location;
  const baseUrls = ["Library", "Search", "More", ""];

  // Get only last route
  let title = pathname.slice(pathname.lastIndexOf("/") + 1);

  // Make it capitalized
  if (title.length > 0) {
    title = `${title[0].toUpperCase()}${title.slice(1)}`;
  }

  // Previous route within tab
  const prevRoute = pathname.slice(0, pathname.lastIndexOf("/"));

  return (
    <header className={styles.header}>
      <div className={styles.container}>
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

        <h1>{title}</h1>

        <div className={styles.placeholder} />
      </div>
    </header>
  );
}

Header.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  }).isRequired
};

export default Header;
