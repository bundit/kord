import React from "react";
import PropTypes from "prop-types";
import styles from "../../styles/header.module.css";

function Header({ location }) {
  const { pathname } = location;

  // Get only last route
  let title = pathname.slice(pathname.lastIndexOf("/") + 1);

  // Make it capitalized
  if (title.length > 0) {
    title = `${title[0].toUpperCase()}${title.slice(1)}`;
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <h1>
          <div>{title}</div>
        </h1>
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
