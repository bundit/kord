import { Link } from "gatsby";
import PropTypes from "prop-types";
import React from "react";
import styles from "./styles/landing.module.css";
import Kord3D from "../assets/kord-3d.svg";
import Icon from "../assets/logo-single-no-white.svg";

const Header = ({ isScrolledPast }) => (
  <header
    className={`${styles.header} ${
      isScrolledPast ? styles.headerScrolled : null
    }`}
  >
    <div className={styles.headerContainer}>
      <Link to="/" className={`${styles.homeLink}`} style={{ display: "flex" }}>
        <span className={styles.svgContainer}>
          <Icon />
        </span>
        <h2>
          <Kord3D />
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
    </div>
  </header>
);

Header.propTypes = {
  isScrolledPast: PropTypes.bool.isRequired
};

Header.defaultProps = {};

export default Header;
