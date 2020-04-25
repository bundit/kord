import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  faSync,
  faExternalLinkAlt,
  faPen
} from "@fortawesome/free-solid-svg-icons";
import { useAlert } from "react-alert";
import React, { useState, useEffect } from "react";

import { capitalizeWord } from "../utils/capitalizeWord";
import {
  clearTrash,
  fetchPlaylists,
  movePlaylistsToTrash,
  restorePlaylistsFromTrash
} from "../redux/actions/libraryActions";
import { getSoundcloudProfile } from "../redux/actions/soundcloudActions";
import FormCheckbox from "./form-checkbox";
import Modal from "./modal";
import placeholderImg from "../assets/placeholder.png";
import styles from "../styles/modal.module.css";

const SettingsForm = ({ show, source, setSettings, onClose, handleUpdate }) => {
  const user = useSelector(state => state.user);
  const playlists = useSelector(state => state.library.playlists);
  const sourcePlaylists = playlists[source];
  const settings = user[source];
  const [playlistSettings, setPlaylistSettings] = useState(sourcePlaylists); // TODO this updates redux state but idk why
  const alert = useAlert();
  const dispatch = useDispatch();

  // Soundcloud edit fields
  const isScConnected = useSelector(state => state.user.soundcloud.isConnected);
  const [showUsernameInput, setShowUsernameInput] = useState(
    !isScConnected && source === "soundcloud"
  );
  const [usernameInput, setUsernameInput] = useState("soundcloud.com/");

  useEffect(() => {
    if (source === "soundcloud") {
      const scUsername = user.soundcloud.username;
      setUsernameInput(`soundcloud.com/${scUsername || ""}`);
      if (!scUsername || !scUsername.length) {
        setShowUsernameInput(true);
      }
    } else {
      setShowUsernameInput(false);
    }
  }, [source, user]);

  useEffect(() => {
    setPlaylistSettings(sourcePlaylists);
  }, [source, playlists, sourcePlaylists]);

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

  function handleSubmitUsername(e) {
    e.preventDefault();
    const inputPrefix = usernameInput.slice(0, 15);
    const inputSuffix = usernameInput.slice(15);

    if (usernameInput.length > 15 && inputPrefix === "soundcloud.com/") {
      // TODO add more input validation here
      dispatch(movePlaylistsToTrash("soundcloud"));

      dispatch(getSoundcloudProfile(inputSuffix))
        .then(() => dispatch(fetchPlaylists(source, inputSuffix)))
        .then(() => {
          dispatch(clearTrash("soundcloud"));
          setShowUsernameInput(false);
          alert.success(`Soundcloud profile ${inputSuffix} connected`);
        })
        .catch(e => {
          dispatch(restorePlaylistsFromTrash("soundcloud"));
          if (e.status === 404) {
            alert.error(`User ${inputSuffix} not found`);
          } else if (e.status === 401) {
            alert.error(`Soundcloud Error: Could not link`);
          } else {
            alert.error(`Uncaught error ${e}`);
          }
        });
    } else {
      alert.error("Invalid Soundcloud profile URL");
    }
  }

  function showInput() {
    setShowUsernameInput(true);
  }

  function handleInputChange(e) {
    setUsernameInput(e.target.value);
  }

  function handleSync() {
    return handleUpdate(source, usernameInput.slice(15));
  }

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
          {!showUsernameInput ? (
            <>
              {source === "soundcloud" ? (
                <button
                  className={styles.editUsernameButton}
                  onClick={showInput}
                >
                  {settings && settings.username}
                  <FontAwesomeIcon icon={faPen} size="sm" />
                </button>
              ) : (
                <div>{settings && settings.username}</div>
              )}

              <div className={styles.profileLinkWrapper}>
                <a
                  href={settings && settings.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.profileAnchor}
                >
                  <span>{settings && settings.profileUrl}</span>

                  <FontAwesomeIcon size="sm" icon={faExternalLinkAlt} />
                </a>
              </div>
            </>
          ) : (
            <form
              className={styles.usernameForm}
              onSubmit={handleSubmitUsername}
            >
              <label
                htmlFor="soundcloudURL"
                className={styles.usernameInputLabel}
              >
                <span>Enter your Soundcloud Profile URL</span>
                <span style={{ display: "flex" }}>
                  <input
                    id="soundcloudURL"
                    className={styles.usernameInput}
                    type="text"
                    placeholder="Enter Soundcloud Profile URL"
                    onChange={handleInputChange}
                    value={usernameInput}
                  />
                  <button type="submit" style={{ marginLeft: "auto" }}>
                    Submit
                  </button>
                </span>
              </label>
            </form>
          )}
        </div>

        <button
          className={styles.syncButton}
          type="button"
          onClick={handleSync}
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
                numTracks={playlist.total}
                onChange={toggleCheckbox}
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
  // TODO implement this
  // This is not doing anything lol
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
