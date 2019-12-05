import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import PlaylistItem from "./playlist-item";
import styles from "../styles/library.module.css";

const ListOfPlaylists = ({ playlists, togglePlaylistForm }) => (
  <>
    <button
      className={styles.addPlaylist}
      onClick={togglePlaylistForm}
      type="button"
    >
      <FontAwesomeIcon icon={faPlus} size="2x" />
    </button>
    <div className={styles.libraryWrapper} zindex="1">
      {playlists &&
        playlists.map(playlist => (
          <PlaylistItem
            key={playlist.title}
            title={playlist.title}
            length={playlist.list.length}
          />
        ))}
    </div>
  </>
);

ListOfPlaylists.propTypes = {
  playlists: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      list: PropTypes.arrayOf(PropTypes.object)
    })
  ).isRequired,
  togglePlaylistForm: PropTypes.func.isRequired
};

export default ListOfPlaylists;
