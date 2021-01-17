import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrash,
  faExternalLinkAlt,
  faListUl
} from "@fortawesome/free-solid-svg-icons";
import { useAlert } from "react-alert";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import React from "react";

import { addTrackToUserQueue } from "../redux/actions/playerActions";
import { formatSourceName } from "../utils/formattingHelpers";
import {
  openAddToPlaylistForm,
  openDeleteTrackForm
} from "../redux/actions/userActions";
import styles from "../styles/track-item.module.scss";

const TrackDropdown = ({
  toggleDropdown,
  track,
  isFromSearch,
  trackIndex,
  playlistId,
  isFromQueue
}) => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const isStreamable = track.streamable || track.streamable === null;

  function handleAddToPlaylistForm(e) {
    dispatch(openAddToPlaylistForm(track));
    toggleDropdown();
    e.stopPropagation();
  }

  function handleRemoveTrack(e) {
    dispatch(openDeleteTrackForm(playlistId, track, trackIndex));
    toggleDropdown();
    e.stopPropagation();
  }

  async function handleTrackExternalLink(e) {
    window.open(
      getTrackExternalLink(track),
      "_blank" // <- This is what makes it open in a new window.
    );
    e.stopPropagation();
  }

  function handleAddTrackToQueue(e) {
    dispatch(addTrackToUserQueue(track));
    alert.success("Track added to queue");
    toggleDropdown();
    e.stopPropagation();
  }

  return (
    <div className={styles.trackDropdown} style={{ borderRadius: "7px" }}>
      {isStreamable && (
        <button
          className={styles.dropdownOption}
          onClick={handleAddTrackToQueue}
          type="button"
        >
          <span>
            <FontAwesomeIcon icon={faListUl} />
          </span>
          <span>Add to Queue</span>
        </button>
      )}
      {(track.source === "youtube" || track.source === "spotify") && (
        <>
          <button
            className={styles.dropdownOption}
            onClick={handleAddToPlaylistForm}
            type="button"
          >
            <span>
              <FontAwesomeIcon icon={faPlus} />
            </span>
            <span>Add to Playlist</span>
          </button>
          {!isFromSearch && !isFromQueue && (
            <button
              className={styles.dropdownOption}
              onClick={handleRemoveTrack}
              type="button"
            >
              <span>
                <FontAwesomeIcon icon={faTrash} />
              </span>
              <span>Remove from Playlist</span>
            </button>
          )}
        </>
      )}

      <button
        className={styles.dropdownOption}
        onClick={handleTrackExternalLink}
        type="button"
      >
        <span>
          <FontAwesomeIcon icon={faExternalLinkAlt} />
        </span>
        <span>{`Open in ${formatSourceName(track.source)}`}</span>
      </button>
    </div>
  );
};

function getTrackExternalLink(track) {
  switch (track.source) {
    case "spotify": {
      return `https://open.spotify.com/track/${track.id}`;
    }

    case "soundcloud": {
      return `https://soundcloud.com/${track.permalink}`;
    }

    case "youtube": {
      return `https://www.youtube.com/watch?v=${track.id}`;
    }

    default: {
      return "";
    }
  }
}

TrackDropdown.propTypes = {
  toggleDropdown: PropTypes.func.isRequired,
  track: PropTypes.shape({
    title: PropTypes.string.isRequired,
    duration: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
      .isRequired,
    artist: PropTypes.oneOfType([
      PropTypes.shape({ name: PropTypes.string.isRequired }),
      PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string.isRequired }))
    ])
  }).isRequired,
  trackIndex: PropTypes.number.isRequired,
  playlistId: PropTypes.string,
  isFromSearch: PropTypes.bool,
  isFromQueue: PropTypes.bool
};

TrackDropdown.defaultProps = {
  playlistId: "",
  isFromSearch: false,
  isFromQueue: false
};

export default TrackDropdown;
