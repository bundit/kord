import React from "react";
import PropTypes from "prop-types";
import styles from "../styles/header.module.css";

function Header(props) {
  const {
    location: { pathname }
  } = props;

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <h1>
          <div>
            {pathname === "/"
              ? "Library"
              : pathname[1].toUpperCase() + pathname.slice(2)}
          </div>
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
