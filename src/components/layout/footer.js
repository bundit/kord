import React from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMusic,
  faSearch,
  faEllipsisH
} from "@fortawesome/free-solid-svg-icons";
import styles from "../../styles/footer.module.css";

const Footer = () => (
  <footer className={styles.footer}>
    <nav>
      <ul className={styles.navUl}>
        <li>
          <NavLink
            exact
            to="/"
            className={styles.navLink}
            activeClassName={styles.active}
          >
            <div className={styles.navWrap}>
              <FontAwesomeIcon icon={faMusic} />
              Library
            </div>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="search"
            className={styles.navLink}
            activeClassName={styles.active}
          >
            <div className={styles.navWrap}>
              <FontAwesomeIcon icon={faSearch} />
              Search
            </div>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="more"
            className={styles.navLink}
            activeClassName={styles.active}
          >
            <div className={styles.navWrap}>
              <FontAwesomeIcon icon={faEllipsisH} />
              More
            </div>
          </NavLink>
        </li>
      </ul>
    </nav>
  </footer>
);

export default Footer;
