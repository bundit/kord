import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import React from "react";

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

  return (
    <div className={styles.trackDropdown} style={{ borderRadius: "7px" }}>
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
    </div>
  );
};

TrackDropdown.propTypes = {
  toggleDropdown: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  track: PropTypes.object.isRequired
};

export default TrackDropdown;
