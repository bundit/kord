import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSoundcloud,
  faSpotify,
  faYoutube
} from "@fortawesome/free-brands-svg-icons";
import {
  faSync,
  faExternalLinkAlt,
  faPen
} from "@fortawesome/free-solid-svg-icons";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import React, { useState, useEffect } from "react";

import { ReactComponent as KordLogo } from "../assets/kord-icon.svg";
import { capitalizeWord } from "../utils/formattingHelpers";
import {
  clearTrash,
  fetchPlaylists,
  movePlaylistsToTrash,
  restorePlaylistsFromTrash,
  setPlaylistConnections
} from "../redux/actions/libraryActions";
import { fetchSoundcloudProfile } from "../redux/actions/soundcloudActions";
import { openSettings } from "../redux/actions/userActions";
import FormCheckbox from "./form-checkbox";
import LoadingSpinner from "./loading-spinner";
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
  const [isLoading, setIsLoading] = useState(false);

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

    if (isConnected) {
      dispatch(setPlaylistConnections(source, playlistSettings));
    }

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
      setIsLoading(true);

      dispatch(fetchSoundcloudProfile(inputSuffix))
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
        })
        .finally(() => setTimeout(() => setIsLoading(false), 500));
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
    setIsLoading(true);
    if (!hasSynced && isConnected) {
      setHasSynced(true);

      return handleUpdate(source, usernameInput.slice(15))
        .catch(e => {
          alert.error(`Error syncing: ${e}`);
        })
        .finally(() => {
          setTimeout(() => setIsLoading(false), 500);
        });
    }
  }

  function getSourceLink(source) {
    if (process.env.NODE_ENV === "development") {
      return `http://localhost:8888/auth/${source}/link`;
    }

    return `/auth/${source}/link`;
  }

  function handleChangeSettingsTab(e) {
    dispatch(openSettings(e.currentTarget.value));
  }

  function getActiveTabClassName(tabSource) {
    if (tabSource === source) {
      return styles.activeTab;
    }
  }

  const sourceTabs = {
    kord: {
      className: styles.kordTab,
      color: "#fb1"
    },
    spotify: {
      className: styles.spotifyTab,
      icon: faSpotify,
      color: "#1db954"
    },
    soundcloud: {
      className: styles.soundcloudTab,
      icon: faSoundcloud,
      color: "#ff5500"
    },
    youtube: {
      className: styles.youtubeTab,
      icon: faYoutube,
      color: "#ff0000"
    }
    // mixcloud: {
    //   className: styles.mixcloudTab,
    //   icon: faMixcloud,
    //   color: "#5000ff",
    // }
  };

  return (
    <Modal
      title={`${capitalizeWord(source)} Settings`}
      show={show}
      onClose={onClose}
    >
      <div className={styles.settingsTabsWrapper}>
        {Object.keys(sourceTabs).map(source => (
          <button
            className={`${styles.settingsTab} ${
              sourceTabs[source].className
            } ${getActiveTabClassName(source)}`}
            onClick={handleChangeSettingsTab}
            value={source}
            key={`${source}-tab`}
          >
            {source === "kord" ? (
              <KordLogo />
            ) : (
              <FontAwesomeIcon
                icon={sourceTabs[source].icon}
                size="lg"
                style={{ color: sourceTabs[source].color }}
              />
            )}
            {capitalizeWord(source)}
          </button>
        ))}
      </div>

      {source === "kord" ? (
        <div>kord settings placeholder</div>
      ) : !isConnected && source !== "soundcloud" ? (
        <a
          className={`${styles.connectSourceLink} ${styles[`${source}Link`]}`}
          href={getSourceLink(source)}
        >
          <FontAwesomeIcon
            icon={sourceTabs[source] ? sourceTabs[source].icon : null}
            style={{ color: sourceTabs[source].color }}
          />
          {`Connect ${capitalizeWord(source)} Account`}
        </a>
      ) : (
        <>
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
        </>
      )}
      <form className={styles.modalForm} onSubmit={onSubmit}>
        {isConnected && (
          <div className={styles.formInnerWrapper}>
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              playlistSettings &&
              playlistSettings.map((playlist, i) => (
                <FormCheckbox
                  title={playlist.title}
                  i={i}
                  key={i}
                  value={playlist.isConnected}
                  numTracks={playlist.total}
                  onChange={toggleCheckbox}
                />
              ))
            )}
          </div>
        )}
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
