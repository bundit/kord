import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, NavLink } from "react-router-dom";
import { connect } from "react-redux";
import {
  faMusic,
  faSearch,
  faCompass
} from "@fortawesome/free-solid-svg-icons";
import { faSoundcloud, faSpotify } from "@fortawesome/free-brands-svg-icons";
import React, { useState } from "react";

import { ReactComponent as Kord3d } from "../assets/circle-logo.svg";
import { flattenPlaylistObject } from "../utils/flattenPlaylistObject";
import { getUserSpotifyPlaylists } from "../redux/actions/spotifyActions";
import ConnectedSourceButton from "./connected-source-button";
import PlaylistItem from "./playlist-item";
import SettingsForm from "./settings-form";
import styles from "../styles/sidebar.module.css";

const Sidebar = ({ user, playlists, updateSpotifyPlaylists }) => {
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

  async function fetchPlaylistsAndToggleSettingsForm(source) {
    if (source === "spotify") {
      await updateSpotifyPlaylists();
    } else if (source === "soundcloud") {
      //
    }
    toggleSettingsForm(source);
  }

  const allPlaylists = flattenPlaylistObject(playlists);

  const playlistComponents = allPlaylists
    .filter(playlist => playlist.isConnected)
    .map(playlist => (
      <PlaylistItem
        sidebar
        key={`sidebar ${playlist.source} ${playlist.title} ${playlist.id}`}
        title={playlist.title}
        id={playlist.id}
        source={playlist.source}
      />
    ));

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
          handleSettings={fetchPlaylistsAndToggleSettingsForm}
          handleConnectSource={redirectToConnectSource}
          source="soundcloud"
          icon={faSoundcloud}
        />
        <ConnectedSourceButton
          isConnected={user.spotify.isConnected}
          handleSettings={fetchPlaylistsAndToggleSettingsForm}
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
        />
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  user: state.user,
  playlists: state.library.playlists
});

const mapDispatchToProps = dispatch => ({
  updateSpotifyPlaylists: () => dispatch(getUserSpotifyPlaylists())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sidebar);
