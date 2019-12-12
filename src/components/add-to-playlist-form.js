import React, { useState } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faCheck } from "@fortawesome/free-solid-svg-icons";

import Modal from "./modal";
import AddToPlaylistCheckbox from "./add-playlist-checkbox";
import styles from "../styles/library.module.css";

const AddToPlaylistForm = ({ show, playlists, onClose, onSubmit }) => {
  // eslint-disable-next-line object-curly-newline
  const initialState = {};

  playlists.forEach(playlist => {
    initialState[playlist] = false;
  });

  const [checkedPlaylists, setCheckedPlaylists] = useState(initialState);
  const [isOneChecked, setIsOneChecked] = useState(false);

  const [newPlaylistField, setnewPlaylistField] = useState("");

  const toggleCheckedPlaylist = value => {
    const newValues = {
      ...checkedPlaylists,
      [value]: !checkedPlaylists[value]
    };

    setCheckedPlaylists(newValues);

    // Check to see if at least one is checked, they are booleans already
    setIsOneChecked(Object.values(newValues).some(isTrue => isTrue));
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

  // TODO add textfield to submit

  return (
    <Modal show={show} onClose={onClose}>
      <h1 className="text-center">Add to Playlist</h1>
      <form
        className={styles.playlistForm}
        onSubmit={e => {
          e.preventDefault();
          onSubmit(prepareFormData());
        }}
      >
        <label className={styles.textboxLabel} htmlFor="newPlaylistField">
          <input
            id="newPlaylistField"
            type="text"
            placeholder="Create New Playlist"
            value={newPlaylistField}
            onChange={e => setnewPlaylistField(e.target.value)}
          />
          <FontAwesomeIcon
            icon={newPlaylistField.length ? faCheck : faPlus}
            style={{
              color: newPlaylistField.length ? "red" : "grey"
            }}
            size="lg"
          />
        </label>
        {playlists.map((playlist, i) => (
          <AddToPlaylistCheckbox
            title={playlist}
            key={playlist}
            i={i}
            value={checkedPlaylists[playlist]}
            onChange={toggleCheckedPlaylist}
          />
        ))}

        {isOneChecked && <button type="submit">Add</button>}
      </form>
    </Modal>
  );
};

AddToPlaylistForm.propTypes = {
  show: PropTypes.bool.isRequired,
  playlists: PropTypes.arrayOf(PropTypes.string).isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default AddToPlaylistForm;
