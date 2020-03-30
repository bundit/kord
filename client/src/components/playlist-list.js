import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusSquare as farPlusSquare } from "@fortawesome/free-regular-svg-icons";
import PropTypes from "prop-types";
import React from "react";

import { flattenPlaylistObject } from "../utils/flattenPlaylistObject";
import PlaylistItem from "./playlist-item";
import styles from "../styles/library.module.css";

const ListOfPlaylists = ({ playlists, toggleNewPlaylistForm }) => {
  const allPlaylists = flattenPlaylistObject(playlists);

  const playlistComponents = allPlaylists.map(playlist => (
    <PlaylistItem
      key={`${playlist.source} ${playlist.title} ${playlist.id}`}
      title={playlist.title}
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
