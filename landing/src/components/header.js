import "../styles/burger.css";

import { Link } from "gatsby";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { slide as Menu } from "react-burger-menu";

import Kord3D from "../assets/circle-logo.svg";
import * as styles from "../styles/header.module.css";

const Header = ({ isScrolledPast }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function handleMenuState(state) {
    setIsMenuOpen(state.isOpen);
  }

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <header
      className={`${styles.header} ${
        isScrolledPast ? styles.headerScrolled : null
      }`}
    >
      <div className={styles.headerContainer}>
        <Link
          to="/"
          className={`${styles.homeLink}`}
          style={{ display: "flex" }}
        >
          <h2>
            <Kord3D />
            <span style={{ display: "none" }}>kord player</span>
          </h2>
        </Link>
        <div className={styles.headerLinks}>
          <Link
            to="/login"
            className={styles.link}
            activeClassName={styles.active}
          >
            Log In
          </Link>
          <Link
            to="/signup"
            className={styles.link}
            activeClassName={styles.active}
          >
            Sign Up
          </Link>
        </div>
        <div className={styles.burgerContainer}>
          <Menu
            isOpen={isMenuOpen}
            right
            onStateChange={handleMenuState}
            width={250}
          >
            <Link
              to="/"
              className={styles.burgerLink}
              activeClassName={styles.burgerActive}
              onClick={closeMenu}
            >
              Home
            </Link>
            <Link
              to="/login"
              className={styles.burgerLink}
              activeClassName={styles.burgerActive}
              onClick={closeMenu}
            >
              Log In
            </Link>
            <Link
              to="/signup"
              className={styles.burgerLink}
              activeClassName={styles.burgerActive}
              onClick={closeMenu}
            >
              Sign Up
            </Link>
          </Menu>
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  isScrolledPast: PropTypes.bool.isRequired
};

Header.defaultProps = {};

export default Header;
