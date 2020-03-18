import { Link } from "gatsby";
import PropTypes from "prop-types";
import React from "react";
import styles from "./styles/landing.module.css";
import Icon from "../images/svg/logo-single-no-white.svg";

const Header = ({ isScrolledPast }) => (
  <header
    className={`${styles.header} ${
      isScrolledPast ? styles.headerScrolled : null
    }`}
  >
    <div className={styles.headerContainer}>
      <Link to="/" className={styles.homeLink} style={{ display: "flex" }}>
        <span className={styles.svgContainer}>
          <Icon />
        </span>
        <h2>kord</h2>
      </Link>
      <div className={styles.headerLinks}>
        <Link to="/login">Log In</Link>
        <Link to="/signup">Sign Up</Link>
      </div>
    </div>
  </header>
);

Header.propTypes = {
  isScrolledPast: PropTypes.bool.isRequired
};

Header.defaultProps = {};

export default Header;
