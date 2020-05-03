import PropTypes from "prop-types";
import React from "react";

import { flattenPlaylistObject } from "../utils/flattenPlaylistObject";
import PlaylistItem from "./playlist-item";
import styles from "../styles/library.module.css";

const ListOfPlaylists = ({ playlists, sidebar }) => {
  const allPlaylists = Array.isArray(playlists)
    ? playlists
    : flattenPlaylistObject(playlists);

  const playlistComponents = allPlaylists
    .filter(playlist => playlist.isConnected)
    .map(playlist => (
      <PlaylistItem
        key={`${playlist.source} ${playlist.title} ${playlist.id}`}
        playlist={playlist}
      />
    ));

  return (
    <div
      className={`${styles.libraryWrapper} ${!sidebar && styles.playlistList}`}
    >
      {playlistComponents}
    </div>
  );
};

ListOfPlaylists.propTypes = {
  playlists: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
};

export default ListOfPlaylists;
