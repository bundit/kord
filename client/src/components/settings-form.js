import { connect } from "react-redux";
import React, { useState, useEffect } from "react";

import { capitalizeWord } from "../utils/capitalizeWord";
import FormCheckbox from "./form-checkbox";
import Modal from "./modal";
import styles from "../styles/modal.module.css";

const SettingsForm = ({ show, source, playlists, setSettings, onClose }) => {
  const sourcePlaylists = playlists[source];
  const [playlistSettings, setPlaylistSettings] = useState(sourcePlaylists);

  useEffect(() => {
    setPlaylistSettings(sourcePlaylists);
  }, [source]); // Safe to omit 'setPlaylistSettings'

  function onSubmit(e) {
    e.preventDefault();
    setSettings(playlistSettings, source);
    onClose();
  }

  function toggleCheckbox(index) {
    const newSettings = playlistSettings.map((playlist, i) => {
      if (i === index) {
        playlist.isConnected = !playlist.isConnected;
      }
      return playlist;
    });

    setPlaylistSettings(newSettings);
  }

  return (
    <Modal
      title={`Settings for ${capitalizeWord(source)}`}
      show={show}
      onClose={onClose}
    >
      <form className={styles.modalForm} onSubmit={onSubmit}>
        <div className={styles.formInnerWrapper}>
          {/* TODO: insert user profile here */}
          {playlistSettings &&
            playlistSettings.map((playlist, i) => (
              <FormCheckbox
                title={playlist.title}
                i={i}
                key={i}
                value={
                  playlistSettings[i] ? playlistSettings[i].isConnected : null
                }
                onChange={() => toggleCheckbox(i)}
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
            Done
          </button>
        </div>
      </form>
    </Modal>
  );
};

const mapStateToProps = state => ({
  playlists: state.library.playlists
});

const mapDispatchToProps = dispatch => ({
  setSettings: (newSettings, source) =>
    dispatch({
      type: "SET_SETTINGS",
      payload: newSettings,
      source
    })
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsForm);
