import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from "react-router-dom";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import React from "react";

import { capitalizeWord } from "../utils/formattingHelpers";
import { getImgUrl } from "../utils/getImgUrl";
import { pause, play, playPlaylist } from "../redux/actions/playerActions";
import sidebarStyles from "../styles/sidebar.module.css";
import styles from "../styles/library.module.css";

const PlaylistItem = ({ playlist, sidebar }) => {
  const { source, id, title } = playlist;
  const dispatch = useDispatch();
  const context = useSelector(state => state.player.context);
  const isPlaying = useSelector(state => state.player.isPlaying);
  // eslint-disable-next-line
  const thisPlaylistIsPlaying = context.id == id && isPlaying;

  function handlePlayPlaylist(e) {
    if (context.id === id) {
      dispatch(play());
    } else {
      dispatch(playPlaylist(playlist));
    }

    e.stopPropagation();
    e.preventDefault();
  }

  function handlePausePlaylist(e) {
    dispatch(pause());

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
            {!playlist.total ? null : !thisPlaylistIsPlaying ? (
              <button
                type="button"
                className={styles.playlistPlayButton}
                onClick={handlePlayPlaylist}
              >
                <FontAwesomeIcon icon={faPlay} size="4x" />
              </button>
            ) : (
              <button
                type="button"
                className={styles.playlistPlayButton}
                onClick={handlePausePlaylist}
              >
                <FontAwesomeIcon icon={faPause} size="4x" />
              </button>
            )}
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
