import {
  faCompass,
  faMusic,
  faSearch
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import React from "react";
import { useSelector } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";
import styles from "../../styles/footer.module.scss";
import Player from "../player";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <Player />
      <div className={styles.mobileFooterWrapper}>
        <MobileFooterNav />
      </div>
    </footer>
  );
};

function MobileFooterNav() {
  const { pathname } = useLocation();
  const userHistory = useSelector((state) => state.user.history);
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

  return navLinks.map((navLink) => (
    <NavLink
      to={navLink.to}
      className={({ isActive }) =>
        classNames(styles.navLink, { [styles.active]: isActive })
      }
      key={`${navLink.to}-footer-nav`}
    >
      <div>
        <FontAwesomeIcon icon={navLink.icon} />
        {navLink.title}
      </div>
    </NavLink>
  ));
}

Footer.defaultProps = {
  libHistory: []
};

export default Footer;
