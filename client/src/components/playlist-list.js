import PropTypes from "prop-types";
import React from "react";

import { flattenPlaylistObject } from "../utils/flattenPlaylistObject";
import PlaylistItem from "./playlist-item";
import styles from "../styles/library.module.css";

const ListOfPlaylists = ({ playlists }) => {
  const allPlaylists = flattenPlaylistObject(playlists);

  const playlistComponents = allPlaylists
    .filter(playlist => playlist.isConnected)
    .map(playlist => (
      <PlaylistItem
        key={`${playlist.source} ${playlist.title} ${playlist.id}`}
        source={playlist.source}
        title={playlist.title}
        id={playlist.id}
      />
    ));

  return (
    <>
      <div className={styles.libraryWrapper}>{playlistComponents}</div>
    </>
  );
};

ListOfPlaylists.propTypes = {
  // eslint-disable-next-line
  playlists: PropTypes.object.isRequired,
  toggleNewPlaylistForm: PropTypes.func.isRequired
};

export default ListOfPlaylists;
