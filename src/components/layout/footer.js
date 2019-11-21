import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMusic,
  faSearch,
  faEllipsisH
} from "@fortawesome/free-solid-svg-icons";
import slide from "../../styles/slide.module.css";
import styles from "../../styles/footer.module.css";

const Footer = ({ isExpanded }) => (
  <CSSTransition
    in={!isExpanded}
    timeout={400}
    classNames={slide}
    unmountOnExit
  >
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
  </CSSTransition>
);

Footer.propTypes = {
  isExpanded: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  isExpanded: state.musicPlayer.isExpanded
});

export default connect(mapStateToProps)(Footer);
