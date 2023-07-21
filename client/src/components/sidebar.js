import {
  faCompass,
  faMusic,
  faSearch,
  faVolumeUp
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

import { ReactComponent as Kord3d } from "../assets/circle-logo.svg";
import { collapsePlayer } from "../redux/actions/playerActions";
import { openSettings } from "../redux/actions/userActions";
import styles from "../styles/sidebar.module.scss";
import { ICONS, SOURCES } from "../utils/constants";
import { flattenPlaylistObject } from "../utils/formattingHelpers";
import ConnectedSourceButton from "./connected-source-button";
import PlaylistList from "./playlist-list";

const Sidebar = () => {
  const playlists = useSelector((state) => state.library.playlists);
  const userHistory = useSelector((state) => state.user.history);
  const user = useSelector((state) => state.user);
  const context = useSelector((state) => state.player.context);
  const isPlaying = useSelector((state) => state.player.isPlaying);

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const isPlayingFromSearch =
    (context.id === "search" || context.search) && isPlaying;

  function toggleSettingsForm(source) {
    dispatch(openSettings(source));
  }

  function handleSearchNavigationOnClick(e) {
    e.preventDefault();
    const { pathname: currentPath } = location;
    const lastPath = userHistory.search[0] || "/app/search";
    const newPath =
      lastPath === currentPath ? "/app/search" : `${lastPath}?restored=true`;

    navigate(newPath);
  }

  function collapsePlayerOnSidebarNavigation(e) {
    let node = e.target;

    function isAnchorTag(tagName) {
      return tagName === "A";
    }

    while (node.parentNode) {
      if (isAnchorTag(node.tagName)) {
        return dispatch(collapsePlayer());
      }

      node = node.parentNode;
    }
  }

  return (
    <div
      className={styles.sidebarWrapper}
      onClick={collapsePlayerOnSidebarNavigation}
    >
      <header className={styles.sidebarHeader}>
        <Link to="/app/">
          <div className={styles.logoWrapper}>
            <Kord3d />
          </div>
        </Link>
      </header>

      <div className={styles.sectionWrapper}>
        <h2>App</h2>
        <AppNavLinks
          isPlayingFromSearch={isPlayingFromSearch}
          handleSearchNavigationOnClick={handleSearchNavigationOnClick}
        />
      </div>

      <div className={styles.sectionWrapper}>
        <h2>Playlists</h2>
        <div className={styles.sidebarScrollWrapper}>
          <StarredPlaylistsNavLinks playlists={playlists} />
          <RemainingPlaylistNavs playlists={playlists} />
        </div>
      </div>

      <div className={styles.sidebarFooter}>
        <SourceButtonList user={user} toggleSettingsForm={toggleSettingsForm} />
      </div>
    </div>
  );
};

function AppNavLinks({ isPlayingFromSearch, handleSearchNavigationOnClick }) {
  const navLinks = [
    { title: "Library", to: "/app/library", exact: true, icon: faMusic },
    { title: "Search", to: "/app/search", icon: faSearch },
    { title: "Explore", to: "/app/explore", icon: faCompass }
  ];

  function getLinkStyle(title) {
    if (title === "Search") {
      return { display: "flex", alignItems: "center" };
    }
  }

  return navLinks.map((link) => (
    <NavLink
      to={link.to}
      exact={link.exact}
      onClick={link.title === "Search" ? handleSearchNavigationOnClick : null}
      className={styles.sidebarNavLink}
      activeClassName={styles.activeNavLink}
      style={getLinkStyle(link.title)}
      key={link.title + "sidebarNav"}
    >
      <FontAwesomeIcon size="lg" icon={link.icon} />
      {link.title}
      {link.title === "Search" && getPlayingFromSearchIcon(isPlayingFromSearch)}
    </NavLink>
  ));
}

function getPlayingFromSearchIcon(isPlayingFromSearch) {
  if (isPlayingFromSearch) {
    return (
      <span style={{ marginLeft: "auto" }}>
        <FontAwesomeIcon icon={faVolumeUp} />
      </span>
    );
  }
}

function StarredPlaylistsNavLinks({ playlists }) {
  const starredPlaylists = flattenPlaylistObject(playlists).filter(
    (playlist) => playlist.isStarred
  );

  return (
    <div className={styles.playlistContainer} key={`sidebar:starred:playlists`}>
      <PlaylistList
        playlists={starredPlaylists}
        isListOfStarredPlaylists
        sidebar
      />
    </div>
  );
}

function RemainingPlaylistNavs({ playlists }) {
  return SOURCES.map((source) => (
    <div
      className={`${styles.playlistContainer} ${
        styles[`${source}PlaylistSection`]
      }`}
      key={`sidebar:${source}:playlists`}
    >
      <PlaylistList
        playlists={playlists[source].filter((playlist) => !playlist.isStarred)}
        source={source}
        sidebar
      />
    </div>
  ));
}

function SourceButtonList({ user, toggleSettingsForm }) {
  return SOURCES.map((source) => (
    <ConnectedSourceButton
      key={`Connect-${source}`}
      isConnected={user[source].isConnected}
      openSettings={toggleSettingsForm}
      source={source}
      icon={ICONS[source]}
    />
  ));
}

const mapStateToProps = (state) => ({
  user: state.user,
  playlists: state.library.playlists
});

export default connect(mapStateToProps)(Sidebar);
