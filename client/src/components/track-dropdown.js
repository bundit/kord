import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrash,
  faExternalLinkAlt
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import React from "react";

import { capitalizeWord } from "../utils/formattingHelpers";
import {
  openAddToPlaylistForm,
  openDeleteTrackForm
} from "../redux/actions/userActions";
import styles from "../styles/library.module.css";

const TrackDropdown = ({
  toggleDropdown,
  track,
  search,
  trackIndex,
  playlistId
}) => {
  const dispatch = useDispatch();

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

  return (
    <div className={styles.trackDropdown} style={{ borderRadius: "7px" }}>
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
          {!search && (
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
        <span>{`Open in ${capitalizeWord(track.source)}`}</span>
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
  // eslint-disable-next-line react/forbid-prop-types
  track: PropTypes.object.isRequired
};

export default TrackDropdown;
