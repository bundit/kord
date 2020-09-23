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
  const playingFromSearch = context.id == "search" && isPlaying;

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

  const playlistComponents = generatePlaylistSidebarComponents(playlists);

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
        <NavLink
          to="/app/library"
          exact
          className={styles.sidebarNavLink}
          activeClassName={styles.activeNavLink}
        >
          <FontAwesomeIcon size="lg" icon={faMusic} />
          Library
        </NavLink>
        <NavLink
          to="/app/search"
          onClick={handleSearchNavigationOnClick}
          className={styles.sidebarNavLink}
          activeClassName={styles.activeNavLink}
          style={{ display: "flex", alignItems: "center" }}
        >
          <FontAwesomeIcon size="lg" icon={faSearch} />
          Search
          {playingFromSearch ? (
            <span style={{ marginLeft: "auto" }}>
              <FontAwesomeIcon icon={faVolumeUp} />
            </span>
          ) : null}
        </NavLink>
        <NavLink
          to="/app/explore"
          className={styles.sidebarNavLink}
          activeClassName={styles.activeNavLink}
        >
          <FontAwesomeIcon size="lg" icon={faCompass} />
          Explore
        </NavLink>
      </div>

      <div className={styles.sectionWrapper}>
        <h2>Playlists</h2>
        <div className={styles.sidebarScrollWrapper}>{playlistComponents}</div>
      </div>
      <div className={styles.sidebarFooter}>
        {Object.keys(sources).map(source => (
          <ConnectedSourceButton
            key={`Connect-${source}`}
            isConnected={user[source].isConnected}
            openSettings={toggleSettingsForm}
            source={source}
            icon={sources[source].icon}
          />
        ))}
      </div>
    </div>
  );
};

function generatePlaylistSidebarComponents(playlists) {
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

const sources = {
  spotify: {
    icon: faSpotify,
    color: "#1db954"
  },
  soundcloud: {
    icon: faSoundcloud,
    color: "#ff5500"
  },
  youtube: {
    icon: faYoutube,
    color: "#ff0000"
  }
  // mixcloud: {
  //   icon: faMixcloud,
  //   color: "#5000ff"
  // }
};

const mapStateToProps = state => ({
  user: state.user,
  playlists: state.library.playlists
});

export default connect(mapStateToProps)(Sidebar);
