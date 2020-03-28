import React, { useState } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faCheck } from "@fortawesome/free-solid-svg-icons";

import Modal from "./modal";
import AddToPlaylistCheckbox from "./add-playlist-checkbox";
import styles from "../styles/modal.module.css";

const AddToPlaylistForm = ({ show, playlistTitles, onClose, onSubmit }) => {
  const [checkedPlaylists, setCheckedPlaylists] = useState(
    initAttributesFromList(playlistTitles)
  );

  const [newPlaylistField, setNewPlaylistField] = useState("");

  const toggleCheckedPlaylist = value => {
    const newValues = {
      ...checkedPlaylists,
      [value]: !checkedPlaylists[value]
    };

    setCheckedPlaylists(newValues);
  };

  const prepareFormData = () => {
    // Only add to playlists that are toggled true
    const playlistsToAddTo = [];
    const titles = Object.keys(checkedPlaylists);
    titles.forEach(title => {
      if (checkedPlaylists[title]) {
        playlistsToAddTo.push(title);
      }
    });

    // If there is any value on the new playlist field, add it to the list
    return newPlaylistField.length
      ? [...playlistsToAddTo, newPlaylistField]
      : playlistsToAddTo;
  };

  const clearForm = () => {
    setNewPlaylistField("");
    setCheckedPlaylists(initAttributesFromList(playlistTitles));
  };

  return (
    <Modal title="Add to Playlist" show={show} onClose={onClose}>
      <form
        className={styles.modalForm}
        onSubmit={e => {
          e.preventDefault();
          onSubmit(prepareFormData());
          clearForm();
        }}
      >
        <div className={styles.formInnerWrapper}>
          <label
            className={`${styles.textfieldCheckmarkLabel} ${
              newPlaylistField.length ? styles.changesMade : null
            }`}
            htmlFor="newPlaylistField"
          >
            <input
              id="newPlaylistField"
              type="text"
              placeholder="Create New Playlist"
              value={newPlaylistField}
              onChange={e => setNewPlaylistField(e.target.value)}
            />
            <FontAwesomeIcon
              icon={newPlaylistField.length ? faCheck : faPlus}
              size="lg"
            />
          </label>
          {playlistTitles.map((playlist, i) => (
            <AddToPlaylistCheckbox
              title={playlist}
              key={playlist}
              i={i}
              value={checkedPlaylists[playlist]}
              onChange={toggleCheckedPlaylist}
            />
          ))}
        </div>
        <div className={styles.formCancelSubmitButtonGroup}>
          <button
            type="button"
            className={styles.formCancelButton}
            onClick={onClose}
          >
            Cancel
          </button>
          <button type="submit" className={styles.formSubmitButton}>
            Finish
          </button>
        </div>
      </form>
    </Modal>
  );
};

// This functions takes a list of strings and returns a new object with
// the object's attributes set by the strings to be the value
// E.g: initAttributesFromList(["a", "b"], true)
// returns {a: true, b: true}
function initAttributesFromList(list, value = false) {
  const object = {};

  list.forEach(attribute => {
    object[attribute] = value;
  });

  return object;
}

AddToPlaylistForm.propTypes = {
  show: PropTypes.bool.isRequired,
  playlistTitles: PropTypes.arrayOf(PropTypes.string).isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default AddToPlaylistForm;
