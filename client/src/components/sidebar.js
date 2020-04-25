import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, NavLink } from "react-router-dom";
import { connect, useDispatch } from "react-redux";
import {
  faMusic,
  faSearch,
  faCompass
} from "@fortawesome/free-solid-svg-icons";
import { faSoundcloud, faSpotify } from "@fortawesome/free-brands-svg-icons";
import { useAlert } from "react-alert";
import React, { useState } from "react";

import { ReactComponent as Kord3d } from "../assets/circle-logo.svg";
import { capitalizeWord } from "../utils/capitalizeWord";
import { fetchPlaylists } from "../redux/actions/libraryActions";
import { fetchProfile } from "../redux/actions/userActions";
import { flattenPlaylistObject } from "../utils/flattenPlaylistObject";
import ConnectedSourceButton from "./connected-source-button";
import PlaylistItem from "./playlist-item";
import SettingsForm from "./settings-form";
import styles from "../styles/sidebar.module.css";

const Sidebar = ({ user, playlists }) => {
  const [isSettingsFormOpen, setIsSettingsFormOpen] = useState(false);
  const [settingsSource, setSettingsSource] = useState();
  function toggleSettingsForm(source) {
    setSettingsSource(source);
    setIsSettingsFormOpen(!isSettingsFormOpen);
  }

  function redirectToConnectSource(source) {
    if (process.env.NODE_ENV === "development") {
      window.location.href = `http://localhost:8888/auth/${source}`;
    } else {
      window.location.href = `/auth/${source}`;
    }
  }

  const allPlaylists = flattenPlaylistObject(playlists);

  const playlistComponents = allPlaylists
    .filter(playlist => playlist.isConnected)
    .map(playlist => (
      <PlaylistItem
        sidebar
        key={`sidebar ${playlist.source} ${playlist.title} ${playlist.id}`}
        title={capitalizeWord(playlist.title)}
        id={playlist.id}
        source={playlist.source}
      />
    ));

  function handleUpdateProfile(source, username) {
    return dispatch(fetchProfile(source, username))
      .then(() => dispatch(fetchPlaylists(source, username)))
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

  const dispatch = useDispatch();
  const alert = useAlert();
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
          className={styles.sidebarNavLink}
          activeClassName={styles.activeNavLink}
        >
          <FontAwesomeIcon size="lg" icon={faMusic} />
          Library
        </NavLink>
        <NavLink
          to="/app/search"
          className={styles.sidebarNavLink}
          activeClassName={styles.activeNavLink}
        >
          <FontAwesomeIcon size="lg" icon={faSearch} />
          Search
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
          isConnected={user.soundcloud.isConnected}
          handleClick={toggleSettingsForm}
          handleConnectSource={toggleSettingsForm}
          source="soundcloud"
          icon={faSoundcloud}
        />
        <ConnectedSourceButton
          isConnected={user.spotify.isConnected}
          handleClick={toggleSettingsForm}
          handleConnectSource={redirectToConnectSource}
          source="spotify"
          icon={faSpotify}
        />
        {/* <ConnectedSourceButton
          isConnected={user.youtube.isConnected}
          handleSettings={toggleSettingsForm}
          handleConnectSource={redirectToConnectSource}
          source="youtube"
          icon={faYoutube}
          />
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
