import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusSquare as farPlusSquare } from "@fortawesome/free-regular-svg-icons";

import PlaylistItem from "./playlist-item";
import styles from "../styles/library.module.css";

const ListOfPlaylists = ({ playlists, toggleNewPlaylistForm }) => (
  <>
    <button
      className={styles.mobileAddPlaylist}
      onClick={toggleNewPlaylistForm}
      type="button"
    >
      <FontAwesomeIcon icon={farPlusSquare} />
    </button>
    <div className={styles.libraryWrapper}>
      {playlists &&
        Object.values(playlists).map(playlist => (
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
  // eslint-disable-next-line
  playlists: PropTypes.object.isRequired,
  toggleNewPlaylistForm: PropTypes.func.isRequired
};

export default ListOfPlaylists;
