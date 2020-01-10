import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";

import styles from "../styles/library.module.css";

const TrackDropdown = ({
  toggleAddToPlaylistForm,
  toggleDropdown,
  toggleEditTrackForm,
  toggleDeleteTrackForm,
  track
}) => (
  <div className={styles.trackDropdown}>
    <button
      className={styles.dropdownOption}
      onClick={e => {
        toggleAddToPlaylistForm(track);
        toggleDropdown();
        e.stopPropagation();
      }}
      type="button"
    >
      <span>
        <FontAwesomeIcon icon={faPlus} />
      </span>
      <span>Add to Playlist</span>
    </button>
    <button
      className={styles.dropdownOption}
      onClick={e => {
        toggleEditTrackForm(track);
        toggleDropdown();
        e.stopPropagation();
      }}
      type="button"
    >
      <span>
        <FontAwesomeIcon icon={faPen} />
      </span>
      <span>Edit Track</span>
    </button>
    <button
      className={styles.dropdownOption}
      onClick={e => {
        toggleDeleteTrackForm(track);
        toggleDropdown();
        e.stopPropagation();
      }}
      type="button"
    >
      <span>
        <FontAwesomeIcon icon={faTrash} />
      </span>
      <span>Delete from Library</span>
    </button>
  </div>
);

TrackDropdown.propTypes = {
  toggleAddToPlaylistForm: PropTypes.func.isRequired,
  toggleDropdown: PropTypes.func.isRequired,
  toggleEditTrackForm: PropTypes.func.isRequired,
  toggleDeleteTrackForm: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  track: PropTypes.object.isRequired
};

export default TrackDropdown;
