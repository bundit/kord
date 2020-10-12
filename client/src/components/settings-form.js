import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExternalLinkAlt,
  faPen,
  faSync,
  faUserSlash
} from "@fortawesome/free-solid-svg-icons";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import React, { useState, useEffect } from "react";

import { COLORS, ICONS, SOURCES } from "../utils/constants";
import {
  DangerousButton,
  SettingsTabButton,
  SubmitButton,
  LargeIconButton as SyncButton
} from "./buttons";
import { PlaylistSettings } from "./playlist-settings";
import { capitalizeWord } from "../utils/formattingHelpers";
import {
  clearTrash,
  movePlaylistsToTrash,
  restorePlaylistsFromTrash,
  setPlaylistSettingsAction
} from "../redux/actions/libraryActions";
import { fetchSoundcloudProfileAndPlaylists } from "../redux/actions/soundcloudActions";
import { openSettings, removeUserProfile } from "../redux/actions/userActions";
import { reorder } from "../utils/reorder";
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
    if (!show) {
      setTimeout(() => setPlaylistSettings([]), 150);
      return;
    }

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
  }, [source, playlists, sourcePlaylists, show]);

  function onSubmit(e) {
    if (isConnected) {
      dispatch(setPlaylistSettingsAction(source, playlistSettings));
    }
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
    e.stopPropagation();
    const inputPrefix = usernameInput.slice(0, 15);
    const inputSuffix = usernameInput.slice(15);

    if (usernameInput.length > 15 && inputPrefix === "soundcloud.com/") {
      // TODO add more input validation here
      dispatch(movePlaylistsToTrash("soundcloud"));
      setIsLoading(true);

      dispatch(fetchSoundcloudProfileAndPlaylists(inputSuffix))
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

  function handleChangeSettingsTab(e) {
    dispatch(openSettings(e.currentTarget.value));
  }

  function handleRemoveAccount() {
    const hasConfirmed = window.confirm("Are you sure?");

    if (hasConfirmed) {
      dispatch(removeUserProfile(source))
        .then(() => alert.success("Account removed"))
        .catch(e => alert.error("Error removing account", e.message));
    }
  }

  function onDragEnd(result) {
    if (!result.destination) {
      return;
    }

    const reordered = reorder(
      playlistSettings,
      result.source.index,
      result.destination.index
    );

    setPlaylistSettings([...reordered]);
  }

  return (
    <Modal
      title={`${capitalizeWord(source)} Settings`}
      show={show}
      onClose={onClose}
      onSubmit={onSubmit}
    >
      <div className={styles.settingsTabsWrapper}>
        {["kord", ...SOURCES].map(tabSource => (
          <SettingsTabButton
            source={tabSource}
            isActive={tabSource === source}
            onClick={handleChangeSettingsTab}
            value={tabSource}
            key={`${tabSource}-tab`}
          >
            {tabSource === "kord" ? (
              ICONS[tabSource]
            ) : (
              <FontAwesomeIcon
                icon={ICONS[tabSource]}
                size="lg"
                style={{ color: COLORS[tabSource] }}
              />
            )}
            {capitalizeWord(tabSource)}
          </SettingsTabButton>
        ))}
      </div>

      {source === "kord" ? (
        <div>kord settings placeholder</div>
      ) : !isConnected && source !== "soundcloud" ? (
        <ConnectSourceLink source={source} />
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

                  <ProfileExternalLink settings={settings} />
                </>
              ) : (
                <SoundcloudInput
                  handleSubmitUsername={handleSubmitUsername}
                  handleInputChange={handleInputChange}
                  usernameInput={usernameInput}
                />
              )}
            </div>
            <SyncButton
              icon={faSync}
              onClick={handleSync}
              disabled={hasSynced}
              style={{ borderColor: "#383f41", marginLeft: "auto" }}
            />
          </div>
          <div className={styles.formTitle}>
            Your {capitalizeWord(source)} playlists
          </div>
        </>
      )}

      <div className={styles.formInnerWrapper}>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          playlistSettings &&
          source !== "kord" && (
            <PlaylistSettings
              settingsList={playlistSettings}
              handleToggle={toggleCheckbox}
              handleDragEnd={onDragEnd}
            />
          )
        )}
      </div>
      {isConnected && (
        <DangerousButton
          onClick={handleRemoveAccount}
          style={{ alignSelf: "center" }}
        >
          <FontAwesomeIcon icon={faUserSlash} />
          {" Remove this account"}
        </DangerousButton>
      )}
    </Modal>
  );
};

function ConnectSourceLink({ source }) {
  function getSourceLink() {
    if (process.env.NODE_ENV === "development") {
      return `http://localhost:8888/auth/${source}/link`;
    }

    return `/auth/${source}/link`;
  }

  return (
    <a
      className={`${styles.connectSourceLink} ${styles[`${source}Link`]}`}
      href={getSourceLink()}
    >
      <FontAwesomeIcon
        icon={ICONS[source]}
        style={{
          color: COLORS[source]
        }}
      />
      {`Connect ${capitalizeWord(source)} Account`}
    </a>
  );
}

function ProfileExternalLink({ settings }) {
  return (
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
  );
}

function SoundcloudInput({
  handleSubmitUsername,
  handleInputChange,
  usernameInput
}) {
  return (
    <label htmlFor="soundcloudURL" className={styles.usernameInputLabel}>
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
        <SubmitButton
          style={{ fontSize: "11px", padding: "8px", marginLeft: "auto" }}
          onClick={handleSubmitUsername}
          type="button" // Prevent closing modal due to type submit
        >
          Submit
        </SubmitButton>
        <button
          type="submit"
          style={{ marginLeft: "auto", padding: "5px" }}
        ></button>
      </span>
    </label>
  );
}

export default SettingsForm;
