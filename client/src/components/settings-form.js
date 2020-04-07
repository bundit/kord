import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { connect, useDispatch, useSelector } from "react-redux";
import { faSync, faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect } from "react";

import { capitalizeWord } from "../utils/capitalizeWord";
import { setSoundcloudProfile } from "../redux/actions/soundcloudActions";
import FormCheckbox from "./form-checkbox";
import Modal from "./modal";
import placeholderImg from "../assets/placeholder.png";
import styles from "../styles/modal.module.css";

const SettingsForm = ({ show, source, setSettings, onClose, handleUpdate }) => {
  const user = useSelector(state => state.user);
  const playlists = useSelector(state => state.library.playlists);
  const sourcePlaylists = playlists[source];
  const settings = user[source];
  const [playlistSettings, setPlaylistSettings] = useState(sourcePlaylists);

  // Soundcloud edit fields
  const isScConnected = useSelector(state => state.user.soundcloud.isConnected);
  const [showUsernameInput, setShowUsernameInput] = useState(!isScConnected);
  const [usernameInput, setUsernameInput] = useState(
    settings ? settings.username : ""
  );

  useEffect(() => {
    setPlaylistSettings(sourcePlaylists);
  }, [source, playlists]); // Safe to omit 'setPlaylistSettings'

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

  const dispatch = useDispatch();
  return (
    <Modal
      title={`${capitalizeWord(source)} Connection Settings`}
      show={show}
      onClose={onClose}
    >
      <div className={styles.profileWrap}>
        <div className={styles.profilePicWrap}>
          <img
            src={settings && settings.image ? settings.image : placeholderImg}
            alt=""
          />
        </div>

        <div className={styles.profileDetails}>
          {source !== "soundcloud" ? (
            <a
              // className={styles.profileDetails}
              href={settings && settings.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div style={{ display: "flex" }}>
                {settings && settings.username}
                <span className={styles.externalIcon}>
                  <FontAwesomeIcon size="sm" icon={faExternalLinkAlt} />
                </span>
              </div>
              <div>{settings && settings.profileUrl}</div>
            </a>
          ) : showUsernameInput ? (
            <form
              style={{ width: "300px", display: "flex" }}
              onSubmit={e => {
                e.preventDefault();
                dispatch(setSoundcloudProfile(usernameInput));
                setShowUsernameInput(false);
              }}
            >
              <input
                className={styles.usernameInput}
                type="text"
                placeholder="Enter Soundcloud Username"
                onChange={e => setUsernameInput(e.target.value)}
                value={usernameInput}
              />
              <button type="submit">submti</button>
            </form>
          ) : (
            <>
              <div style={{ display: "flex" }}>
                {settings && settings.username}
                <span className={styles.externalIcon}>
                  <FontAwesomeIcon size="sm" icon={faExternalLinkAlt} />
                </span>
              </div>
              <div>{settings && settings.profileUrl}</div>
            </>
          )}
        </div>

        <button
          className={styles.syncButton}
          type="button"
          onClick={() => handleUpdate(source)}
        >
          <FontAwesomeIcon size="2x" icon={faSync} />
        </button>
      </div>
      <div className={styles.formTitle}>
        Your {capitalizeWord(source)} playlists
      </div>
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

const mapDispatchToProps = dispatch => ({
  setSettings: (newSettings, source) =>
    dispatch({
      type: "SET_SETTINGS",
      payload: newSettings,
      source
    })
});

export default connect(
  null,
  mapDispatchToProps
)(SettingsForm);
