import { faStar, faVolumeUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

import { toggleStarPlaylist } from "../redux/actions/libraryActions";
import { pause, play, playPlaylist } from "../redux/actions/playerActions";
import styles from "../styles/playlist-item.module.scss";
import sidebarStyles from "../styles/sidebar.module.scss";
import { ICONS } from "../utils/constants";
import { capitalizeWord, getImgUrl } from "../utils/formattingHelpers";
import { PlayPauseButton } from "./buttons";
import Image from "./image";

const PlaylistItem = ({ playlist, sidebar, isStarredPlaylist }) => {
  const { source, id, title } = playlist;
  const dispatch = useDispatch();
  const context = useSelector((state) => state.player.context);
  const isPlaying = useSelector((state) => state.player.isPlaying);

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
    dispatch(toggleStarPlaylist(id, source));

    e.stopPropagation();
    e.preventDefault();
  }

  function getPlaylistHref() {
    return `/app/library/playlists/${source}/${encodeURIComponent(
      id
    )}/${encodeURIComponent(title)}`;
  }

  return (
    <NavLink
      to={getPlaylistHref()}
      className={({ isActive }) =>
        classNames({
          [sidebarStyles.sidebarNavLink]: sidebar,
          [styles.playlistItem]: !sidebar,
          [sidebarStyles.activeNavLink]: isActive
        })
      }
    >
      {!sidebar && (
        <PlaylistImage
          playlist={playlist}
          isPlaying={thisPlaylistIsPlaying}
          hasContext={thisPlaylistHasContext}
          handlePlayPause={handlePlayPausePlaylist}
        />
      )}
      <div className={styles.playlistInfoWrap}>
        {!sidebar ? (
          <PlaylistInfo
            playlist={playlist}
            toggleStar={handleToggleStarPlaylist}
          />
        ) : (
          <SidebarPlaylistInfo
            playlist={playlist}
            toggleStar={handleToggleStarPlaylist}
            isPlaying={thisPlaylistIsPlaying}
          />
        )}
      </div>
    </NavLink>
  );
};

function PlaylistImage({ playlist, isPlaying, hasContext, handlePlayPause }) {
  return (
    <div className={styles.playlistImageWrap}>
      <Image
        src={getImgUrl(playlist, "lg")}
        alt={`${playlist.title}-art`}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          right: 0
        }}
      />
      <div
        className={styles.playlistImageOverlay}
        style={{ opacity: hasContext ? 1 : null }}
      >
        {!playlist.total ? null : (
          <PlayPauseButton
            onClick={handlePlayPause}
            isPlaying={isPlaying}
            size="3x"
            style={{ margin: "0 auto" }}
          />
        )}
      </div>
    </div>
  );
}

function PlaylistInfo({ playlist, toggleStar }) {
  const { title, isStarred, total } = playlist;
  return (
    <div>
      <h3>{capitalizeWord(title)}</h3>
      <button
        type="button"
        onClick={toggleStar}
        className={styles.smallStarPlaylistButton}
        style={{
          marginRight: "5px",
          color: isStarred ? "#ffc842" : "#555"
        }}
      >
        <FontAwesomeIcon icon={faStar} size="1x" />
      </button>
      <span>{`${total} Tracks`}</span>
    </div>
  );
}

function SidebarPlaylistInfo({ playlist, toggleStar, isPlaying }) {
  const { isStarred, title, source } = playlist;
  return (
    <div style={{ display: "flex" }}>
      {isStarred && (
        <button
          type="button"
          onClick={toggleStar}
          className={styles.smallStarPlaylistButton}
          style={{ color: isStarred ? "#ffc842" : "#555" }}
        >
          <FontAwesomeIcon icon={faStar} size="sm" />
        </button>
      )}
      <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}>
        {capitalizeWord(title)}
      </span>

      <span className={sidebarStyles.sourceIcon}>
        <FontAwesomeIcon icon={ICONS[source]} size="lg" />
      </span>
      {isPlaying && (
        <span className={sidebarStyles.speakerIcon}>
          <FontAwesomeIcon icon={faVolumeUp} />
        </span>
      )}
    </div>
  );
}

PlaylistItem.propTypes = {
  playlist: PropTypes.object,
  sidebar: PropTypes.bool
};

PlaylistItem.defaultProps = {
  playlist: {},
  sidebar: false
};

export default PlaylistItem;
