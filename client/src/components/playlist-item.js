import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from "react-router-dom";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import React from "react";

import { capitalizeWord } from "../utils/capitalizeWord";
import { getImgUrl } from "../utils/getImgUrl";
import { loadPlaylistTracks } from "../redux/actions/libraryActions";
import { playTrack } from "../redux/actions/playerActions";
import sidebarStyles from "../styles/sidebar.module.css";
import styles from "../styles/library.module.css";

const PlaylistItem = ({ playlist, sidebar }) => {
  const { source, id, title, next } = playlist;
  const dispatch = useDispatch();

  function handlePlayPlaylist(e) {
    if (!playlist.tracks.length) {
      dispatch(loadPlaylistTracks(source, id, next)).then(() =>
        dispatch(playTrack(0, playlist.tracks))
      );
    } else {
      dispatch(playTrack(0, playlist.tracks));
    }

    e.stopPropagation();
    e.preventDefault();
  }

  return (
    <NavLink
      to={`/app/library/playlists/${source}/${id}/${title}`}
      className={sidebar ? sidebarStyles.sidebarNavLink : styles.playlistItem}
      activeClassName={sidebar ? sidebarStyles.activeNavLink : null}
    >
      {!sidebar && (
        <div className={styles.playlistImageWrap}>
          <img src={getImgUrl(playlist, "lg")} alt={`${title}-art`} />
          <div className={styles.playlistImageOverlay}>
            {playlist.total ? (
              <button
                type="button"
                className={styles.playlistPlayButton}
                onClick={handlePlayPlaylist}
              >
                <FontAwesomeIcon icon={faPlay} size="4x" />
              </button>
            ) : null}
          </div>
        </div>
      )}
      <div className={styles.playlistInfoWrap}>
        {!sidebar ? (
          <div>
            <h3>{capitalizeWord(title)}</h3>
            <span>{`${playlist.total} Tracks`}</span>
          </div>
        ) : (
          <div>{capitalizeWord(title)}</div>
        )}
      </div>
    </NavLink>
  );
};

PlaylistItem.propTypes = {
  playlist: PropTypes.object,
  sidebar: PropTypes.bool
};

PlaylistItem.defaultProps = {
  playlist: {},
  sidebar: false
};

export default PlaylistItem;
