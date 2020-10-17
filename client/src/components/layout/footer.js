import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink, useLocation } from "react-router-dom";
import {
  faMusic,
  faSearch,
  faCompass
} from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import React from "react";

import Player from "../player";
import styles from "../../styles/footer.module.scss";

const Footer = ({ location }) => {
  return (
    <footer className={styles.footer}>
      <Player />
      <div className={styles.mobileFooterWrapper}>
        <MobileFooterNav location={location} />
      </div>
    </footer>
  );
};

function MobileFooterNav() {
  const { pathname } = useLocation();
  const userHistory = useSelector(state => state.user.history);
  let {
    library: [lastLibraryRoute],
    search: [lastSearchRoute]
  } = userHistory;
  let [lastExploreRoute] = ["/app/explore"];

  function getToHref(lastRoute, baseRoute) {
    lastRoute = lastRoute || baseRoute;

    if (lastRoute === pathname) {
      return baseRoute;
    }

    return lastRoute;
  }

  const navLinks = [
    {
      title: "Library",
      icon: faMusic,
      to: getToHref(lastLibraryRoute, "/app/library")
    },
    {
      title: "Search",
      icon: faSearch,
      to: getToHref(lastSearchRoute, "/app/search")
    },
    {
      title: "Explore",
      icon: faCompass,
      to: getToHref(lastExploreRoute, "/app/explore")
    }
  ];

  return navLinks.map(navLink => (
    <NavLink
      to={navLink.to}
      className={styles.navLink}
      activeClassName={styles.active}
      key={`${navLink.to}-footer-nav`}
    >
      <div>
        <FontAwesomeIcon icon={navLink.icon} />
        {navLink.title}
      </div>
    </NavLink>
  ));
}

Footer.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string
  }).isRequired
};

Footer.defaultProps = {
  libHistory: []
};

export default Footer;
