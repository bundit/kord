import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, NavLink, useHistory, useLocation } from "react-router-dom";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  faMusic,
  faSearch,
  faCompass,
  faVolumeUp
} from "@fortawesome/free-solid-svg-icons";
import {
  faSoundcloud,
  faSpotify,
  faYoutube
} from "@fortawesome/free-brands-svg-icons";
import React from "react";

import { ReactComponent as Kord3d } from "../assets/circle-logo.svg";
import { flattenPlaylistObject } from "../utils/flattenPlaylistObject";
import { openSettings } from "../redux/actions/userActions";
import ConnectedSourceButton from "./connected-source-button";
import PlaylistList from "./playlist-list";
import styles from "../styles/sidebar.module.css";

const Sidebar = ({ user, playlists }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const userHistory = useSelector(state => state.user.history);
  const location = useLocation();
  const player = useSelector(state => state.player);
  const { context, isPlaying } = player; // eslint-disable-next-line
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

    history.push(newPath);
  }

  const appNavLinkComponents = generateAppNavLinkComponents(
    isPlayingFromSearch,
    handleSearchNavigationOnClick
  );
  const sourceButtonComponents = generateSourceButtonComponents(
    user,
    toggleSettingsForm
  );
  const playlistNavLinkComponents = generatePlaylistNavlinkComponents(
    playlists
  );

  return (
    <div className={styles.sidebarWrapper}>
      <div className={styles.sidebarHeader}>
        <Link to="/app/">
          <div className={styles.logoWrapper}>
            <Kord3d />
          </div>
        </Link>
      </div>
      <div className={styles.sectionWrapper}>
        <h2>App</h2>
        {appNavLinkComponents}
      </div>

      <div className={styles.sectionWrapper}>
        <h2>Playlists</h2>
        <div className={styles.sidebarScrollWrapper}>
          {playlistNavLinkComponents}
        </div>
      </div>
      <div className={styles.sidebarFooter}>{sourceButtonComponents}</div>
    </div>
  );
};

function generateAppNavLinkComponents(isPlayingFromSearch, searchOnClick) {
  const navLinks = [
    { title: "Library", to: "/app/library", exact: true, icon: faMusic },
    { title: "Search", to: "/app/search", icon: faSearch },
    { title: "Explore", to: "/app/explore", icon: faCompass }
  ];

  return navLinks.map(link => (
    <NavLink
      to={link.to}
      exact={link.exact}
      onClick={link.title === "Search" ? searchOnClick : null}
      className={styles.sidebarNavLink}
      activeClassName={styles.activeNavLink}
      style={
        link.title === "Search"
          ? { display: "flex", alignItems: "center" }
          : null
      }
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

function generatePlaylistNavlinkComponents(playlists) {
  const playlistComponents = [];

  const starredPlaylists = (
    <PlaylistList
      playlists={flattenPlaylistObject(playlists).filter(
        playlist => playlist.isStarred
      )}
      key={`sidebar:starred:playlists`}
      isListOfStarredPlaylists
      sidebar
    />
  );

  playlistComponents.push(starredPlaylists);

  for (let source in playlists) {
    playlistComponents.push(
      <PlaylistList
        playlists={playlists[source].filter(playlist => !playlist.isStarred)}
        source={source}
        sidebar
        key={`sidebar:${source}:playlists`}
      />
    );
  }

  return playlistComponents;
}

function generateSourceButtonComponents(user, toggleSettingsForm) {
  const sourceButtons = [
    { source: "spotify", icon: faSpotify, color: "#1db954" },
    { source: "soundcloud", icon: faSoundcloud, color: "#ff5500" },
    { source: "youtube", icon: faYoutube, color: "#ff0000" }
  ];

  return sourceButtons.map(button => (
    <ConnectedSourceButton
      key={`Connect-${button.source}`}
      isConnected={user[button.source].isConnected}
      openSettings={toggleSettingsForm}
      source={button.source}
      icon={button.icon}
    />
  ));
}

const mapStateToProps = state => ({
  user: state.user,
  playlists: state.library.playlists
});

export default connect(mapStateToProps)(Sidebar);
