import PropTypes from "prop-types";
import React from "react";

import { flattenPlaylistObject } from "../utils/flattenPlaylistObject";
import PlaylistItem from "./playlist-item";
import styles from "../styles/library.module.css";
import sidebarStyles from "../styles/sidebar.module.css";

const ListOfPlaylists = ({
  playlists,
  sidebar,
  isListOfStarredPlaylists,
  source
}) => {
  const allPlaylists = Array.isArray(playlists)
    ? playlists
    : flattenPlaylistObject(playlists);

  const playlistComponents = allPlaylists
    .filter(playlist => playlist.isConnected)
    .map(playlist => (
      <PlaylistItem
        key={`${playlist.source} ${playlist.title} ${playlist.id}`}
        playlist={playlist}
        sidebar={sidebar}
        isStarredPlaylist={isListOfStarredPlaylists}
      />
    ));

  function getPlaylistWrapperClasses() {
    if (sidebar) {
      return `${sidebarStyles.playlistContainer} ${
        sidebarStyles[`${source}PlaylistList`]
      }`;
    } else {
      return `${styles.libraryWrapper} ${styles.playlistList}`;
    }
  }

  return (
    <div className={getPlaylistWrapperClasses()}>{playlistComponents}</div>
  );
};

ListOfPlaylists.propTypes = {
  playlists: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
};

export default ListOfPlaylists;
