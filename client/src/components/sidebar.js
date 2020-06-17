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
import { useAlert } from "react-alert";
import React, { useState } from "react";

import { ReactComponent as Kord3d } from "../assets/circle-logo.svg";
import { fetchProfileAndPlaylists } from "../redux/actions/userActions";
import { flattenPlaylistObject } from "../utils/flattenPlaylistObject";
import ConnectedSourceButton from "./connected-source-button";
import PlaylistItem from "./playlist-item";
import SettingsForm from "./settings-form";
import styles from "../styles/sidebar.module.css";

const Sidebar = ({ user, playlists }) => {
  const [isSettingsFormOpen, setIsSettingsFormOpen] = useState(false);
  const [settingsSource, setSettingsSource] = useState();
  const dispatch = useDispatch();
  const history = useHistory();
  const alert = useAlert();
  const userHistory = useSelector(state => state.user.history);
  const location = useLocation();
  const player = useSelector(state => state.player);
  const { context, isPlaying } = player; // eslint-disable-next-line
  const playingFromSearch = context.id == "search" && isPlaying;

  function toggleSettingsForm(source) {
    setSettingsSource(source);
    setIsSettingsFormOpen(!isSettingsFormOpen);
  }

  function redirectToConnectSource(source) {
    if (process.env.NODE_ENV === "development") {
      window.location.href = `http://localhost:8888/auth/${source}/link`;
    } else {
      window.location.href = `/auth/${source}/link`;
    }
  }

  const allPlaylists = flattenPlaylistObject(playlists);

  const playlistComponents = allPlaylists
    .filter(playlist => playlist.isConnected)
    .map(playlist => (
      <PlaylistItem
        sidebar
        key={`sidebar ${playlist.source} ${playlist.title} ${playlist.id}`}
        playlist={playlist}
      />
    ));

  function handleUpdateProfile(source, user) {
    return dispatch(fetchProfileAndPlaylists(source, user))
      .then(() => {
        alert.success("Profile Refreshed");
      })
      .catch(e => {
        if (e.status === 0) {
          alert.error("Connection Error");
        } else {
          alert.error(`Unhandled Error${e.status}`);
        }
      });
  }

  function handleSearchNavigationOnClick(e) {
    e.preventDefault();
    const { pathname: currentPath } = location;
    const lastPath = userHistory.search[0] || "/app/search";
    const newPath =
      lastPath === currentPath ? "/app/search" : `${lastPath}?restored=true`;

    history.push(newPath);
  }

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
        <div className={styles.playlistContainer}>{playlistComponents}</div>
      </div>
      <div className={styles.sidebarFooter}>
        <ConnectedSourceButton
          isConnected={user.spotify.isConnected}
          handleClick={toggleSettingsForm}
          handleConnectSource={redirectToConnectSource}
          source="spotify"
          icon={faSpotify}
        />
        <ConnectedSourceButton
          isConnected={user.soundcloud.isConnected}
          handleClick={toggleSettingsForm}
          handleConnectSource={toggleSettingsForm}
          source="soundcloud"
          icon={faSoundcloud}
        />
        <ConnectedSourceButton
          isConnected={user.youtube.isConnected}
          handleClick={toggleSettingsForm}
          handleConnectSource={redirectToConnectSource}
          source="youtube"
          icon={faYoutube}
        />
        {/*
          <ConnectedSourceButton
          isConnected={user.mixcloud.isConnected}
          handleSettings={toggleSettingsForm}
          handleConnectSource={redirectToConnectSource}
          source="mixcloud"
          icon={faMixcloud}
        /> */}
        <SettingsForm
          show={isSettingsFormOpen}
          source={settingsSource}
          onClose={toggleSettingsForm}
          handleUpdate={handleUpdateProfile}
        />
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  user: state.user,
  playlists: state.library.playlists
});

export default connect(mapStateToProps)(Sidebar);
