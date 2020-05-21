import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSync,
  faExternalLinkAlt,
  faPen
} from "@fortawesome/free-solid-svg-icons";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import React, { useState, useEffect } from "react";

import { capitalizeWord } from "../utils/formattingHelpers";
import {
  clearTrash,
  fetchPlaylists,
  movePlaylistsToTrash,
  restorePlaylistsFromTrash,
  setPlaylistConnections
} from "../redux/actions/libraryActions";
import { getSoundcloudProfile } from "../redux/actions/soundcloudActions";
import FormCheckbox from "./form-checkbox";
import Modal from "./modal";
import avatarImg from "../assets/avatar-placeholder.png";
import styles from "../styles/modal.module.css";

const SettingsForm = ({ show, source, onClose, handleUpdate }) => {
  const user = useSelector(state => state.user);
  const playlists = useSelector(state => state.library.playlists);
  const isConnected = source && user[source] ? user[source].isConnected : null;
  const alert = useAlert();
  const dispatch = useDispatch();
  const sourcePlaylists = playlists[source];
  const settings = user[source];
  const [playlistSettings, setPlaylistSettings] = useState([]);
  const [hasSynced, setHasSynced] = useState(false);

  const [showUsernameInput, setShowUsernameInput] = useState(
    !isConnected && source === "soundcloud"
  );
  const [usernameInput, setUsernameInput] = useState("soundcloud.com/");

  useEffect(() => {
    if (source) {
      setHasSynced(!isConnected);
    }
  }, [source, isConnected]);

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
    if (sourcePlaylists) {
      const settings = sourcePlaylists.map(
        ({ title, id, isConnected, total }) => ({
          title,
          id,
          isConnected,
          total
        })
      );
      setPlaylistSettings(settings);
    }
  }, [source, playlists, sourcePlaylists]);

  function onSubmit(e) {
    e.preventDefault();

    dispatch(setPlaylistConnections(source, playlistSettings));
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

  function handleSync(e) {
    if (!hasSynced && isConnected) {
      setHasSynced(true);

      return handleUpdate(source, usernameInput.slice(15)).catch(e => {
        alert.error(`Error syncing: ${e}`);
      });
    }
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
            src={settings && settings.image ? settings.image : avatarImg}
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
          disabled={hasSynced}
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
                value={playlist.isConnected}
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

export default SettingsForm;
