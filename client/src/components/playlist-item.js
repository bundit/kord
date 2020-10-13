import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from "react-router-dom";
import {
  faSpotify,
  faSoundcloud,
  faYoutube
} from "@fortawesome/free-brands-svg-icons";
import { faStar, faVolumeUp } from "@fortawesome/free-solid-svg-icons";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import React from "react";

import { PlayPauseButton } from "./buttons";
import { capitalizeWord } from "../utils/formattingHelpers";
import { getImgUrl } from "../utils/getImgUrl";
import { pause, play, playPlaylist } from "../redux/actions/playerActions";
import { toggleStarPlaylist } from "../redux/actions/libraryActions";
import sidebarStyles from "../styles/sidebar.module.css";
import styles from "../styles/library.module.css";

const PlaylistItem = ({ playlist, sidebar, isStarredPlaylist }) => {
  const { source, id, title } = playlist;
  const dispatch = useDispatch();
  const alert = useAlert();
  const context = useSelector(state => state.player.context);
  const isPlaying = useSelector(state => state.player.isPlaying);
  const isStarred = playlist.isStarred;

  // eslint-disable-next-line
  const thisPlaylistHasContext = context.source === source && context.id == id;
  const thisPlaylistIsPlaying = thisPlaylistHasContext && isPlaying;

  function handlePlayPausePlaylist(e) {
    if (thisPlaylistIsPlaying) {
      dispatch(pause());
    } else {
      if (context.id === id && context.source === source) {
        dispatch(play());
      } else {
        dispatch(playPlaylist(playlist));
      }
    }

    e.stopPropagation();
    e.preventDefault();
  }

  function handleToggleStarPlaylist(e) {
    dispatch(toggleStarPlaylist(id, source)).catch(e =>
      alert.error("Network Error")
    );

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
          <div
            className={styles.playlistImageOverlay}
            style={{ opacity: thisPlaylistHasContext ? 1 : null }}
          >
            {!playlist.total ? null : (
              <PlayPauseButton
                onClick={handlePlayPausePlaylist}
                isPlaying={thisPlaylistIsPlaying}
                size="3x"
                style={{ margin: "0 auto" }}
              />
            )}
          </div>
        </div>
      )}
      <div className={styles.playlistInfoWrap}>
        {!sidebar ? (
          <div>
            <h3>{capitalizeWord(title)}</h3>
            <button
              type="button"
              onClick={handleToggleStarPlaylist}
              className={styles.smallStarPlaylistButton}
              style={{
                marginRight: "5px",
                color: isStarred ? "#ffc842" : "#555"
              }}
            >
              <FontAwesomeIcon icon={faStar} size="1x" />
            </button>
            <span>{`${playlist.total} Tracks`}</span>
          </div>
        ) : (
          <div style={{ display: "flex" }}>
            {isStarredPlaylist && (
              <button
                type="button"
                onClick={handleToggleStarPlaylist}
                className={styles.smallStarPlaylistButton}
                style={{ color: isStarred ? "#ffc842" : "#555" }}
              >
                <FontAwesomeIcon icon={faStar} size="sm" />
              </button>
            )}
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
