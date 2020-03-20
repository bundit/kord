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
import rippleEffect from "../../utils/rippleEffect";
import styles from "../../styles/footer.module.css";

const Footer = ({ isExpanded, location, libHistory }) => {
  const { pathname } = location;
  const pastLibRoute = libHistory.length
    ? libHistory[libHistory.length - 1]
    : "/app/library";

  const libNavSecondTap = pastLibRoute === pathname;

  return (
    <CSSTransition in={!isExpanded} timeout={400} classNames={slide}>
      <footer className={styles.footer}>
        <nav>
          <ul className={styles.navUl}>
            <li>
              <NavLink
                to={`${libNavSecondTap ? "/app/library" : pastLibRoute}`}
                className={styles.navLink}
                activeClassName={styles.active}
                onClick={rippleEffect}
              >
                <div className={styles.navWrap}>
                  <FontAwesomeIcon icon={faMusic} />
                  Library
                </div>
              </NavLink>
            </li>
            <li>
              <NavLink
                exact
                to="/app/search"
                className={styles.navLink}
                activeClassName={styles.active}
                onClick={rippleEffect}
              >
                <div className={styles.navWrap}>
                  <FontAwesomeIcon icon={faSearch} />
                  Search
                </div>
              </NavLink>
            </li>
            <li>
              <NavLink
                exact
                to="/app/more"
                className={styles.navLink}
                activeClassName={styles.active}
                onClick={rippleEffect}
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
};

Footer.propTypes = {
  isExpanded: PropTypes.bool.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string
  }).isRequired,
  libHistory: PropTypes.arrayOf(PropTypes.string).isRequired
};

Footer.defaultProps = {
  libHistory: []
};

const mapStateToProps = state => ({
  isExpanded: state.musicPlayer.isExpanded,
  libHistory: state.user.history.library
});

const mapDispatchToProps = dispatch => ({
  saveLibRoute: route =>
    dispatch({
      type: "SAVE_LIB_ROUTE",
      payload: route
    })
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Footer);
