import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from "react-router-dom";
import { faPlay, faPause, faVolumeUp } from "@fortawesome/free-solid-svg-icons";
import {
  faSpotify,
  faSoundcloud,
  faYoutube
} from "@fortawesome/free-brands-svg-icons";
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

  const thisPlaylistIsPlaying = // eslint-disable-next-line
    context.source === source && context.id == id && isPlaying;

  function handlePlayPlaylist(e) {
    if (context.id === id && context.source === source) {
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

  const icons = {
    spotify: faSpotify,
    soundcloud: faSoundcloud,
    youtube: faYoutube
  };

  const sourceIcon = icons[source];

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
          <div style={{ display: "flex" }}>
            <span
              style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}
            >
              {capitalizeWord(title)}
            </span>

            <span className={sidebarStyles.sourceIcon}>
              <FontAwesomeIcon icon={sourceIcon} size="lg" />
            </span>
            {thisPlaylistIsPlaying && (
              <span className={sidebarStyles.speakerIcon}>
                <FontAwesomeIcon icon={faVolumeUp} />
              </span>
            )}
          </div>
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
