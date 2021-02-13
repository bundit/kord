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
import { ReactComponent as YouTubeFullColorIcon } from "../assets/youtube-icon-full-color.svg";
import {
  clearTrash,
  movePlaylistsToTrash,
  restorePlaylistsFromTrash,
  setPlaylistSettingsAction
} from "../redux/actions/libraryActions";
import { fetchSoundcloudProfileAndPlaylists } from "../redux/actions/soundcloudActions";
import { formatSourceName, reorder } from "../utils/formattingHelpers";
import { openSettings, removeUserProfile } from "../redux/actions/userActions";
import Image from "./image";
import KordSettings from "./kord-settings";
import LoadingSpinner from "./loading-spinner";
import Modal from "./modal";
import avatarImg from "../assets/avatar-placeholder.png";
import formStyles from "../styles/form.module.scss";
import styles from "../styles/settings-form.module.scss";

const SettingsForm = ({ show, source, onClose, handleUpdate }) => {
  const user = useSelector(state => state.user);
  const playlists = useSelector(state => state.library.playlists);
  const mainConnection = useSelector(state => state.user.kord.mainConnection);
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
        ({ title, id, isConnected, total, isStarred }) => ({
          title,
          id,
          isConnected,
          total,
          isStarred
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

    const soundcloudURLRegEx = /^(https:\/\/|http:\/\/)?(www.)?soundcloud.com\/(.+)/;
    const usernameMatch = usernameInput.match(soundcloudURLRegEx);

    if (usernameMatch) {
      const username = usernameMatch[usernameMatch.length - 1];

      dispatch(movePlaylistsToTrash("soundcloud"));
      setIsLoading(true);

      dispatch(fetchSoundcloudProfileAndPlaylists(username))
        .then(() => {
          dispatch(clearTrash("soundcloud"));
          setShowUsernameInput(false);
          alert.success(`Soundcloud profile ${username} connected`);
        })
        .catch(e => {
          dispatch(restorePlaylistsFromTrash("soundcloud"));
          if (e.status === 404) {
            alert.error(`User ${username} not found`);
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
    onSubmit();
    dispatch(openSettings(e.currentTarget.value));
  }

  function handleRemoveAccount() {
    if (mainConnection === source) {
      return alert.error("Cannot remove main connection");
    }

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

    if (!validateReordering(reordered)) {
      return alert.error("Starred playlists must come first");
    }

    setPlaylistSettings([...reordered]);
  }

  function validateReordering(newList) {
    let starredFirst = true;

    for (const playlist of newList) {
      if (playlist.isStarred && !starredFirst) {
        return false;
      }

      starredFirst = starredFirst && playlist.isStarred;
    }

    return true;
  }

  return (
    <Modal
      title={`${formatSourceName(source)} Settings`}
      show={show}
      onClose={onClose}
      onSubmit={onSubmit}
    >
      <SettingsTabsHeader
        handleTabClick={handleChangeSettingsTab}
        currerntSource={source}
      />

      {source === "kord" ? (
        <KordSettings />
      ) : !isConnected && source !== "soundcloud" ? (
        <ConnectSourceLink source={source} />
      ) : (
        <>
          <div className={styles.profileWrap}>
            <Image
              src={settings && settings.image ? settings.image : avatarImg}
              alt={`${source}-profile-pic`}
            />

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
          <div className={formStyles.formTitle}>
            Your {formatSourceName(source)} playlists
          </div>
        </>
      )}

      <div className={formStyles.formInnerWrapper}>
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

function SettingsTabsHeader({ handleTabClick, currerntSource }) {
  return (
    <div className={styles.settingsTabsWrapper}>
      {["kord", ...SOURCES].map(tabSource => (
        <SettingsTabButton
          source={tabSource}
          isActive={tabSource === currerntSource}
          onClick={handleTabClick}
          value={tabSource}
          key={`${tabSource}-tab`}
        >
          {tabSource === "kord" ? (
            ICONS[tabSource]
          ) : tabSource === "youtube" ? (
            <YouTubeFullColorIcon />
          ) : (
            <FontAwesomeIcon
              icon={ICONS[tabSource]}
              size="lg"
              style={{ color: COLORS[tabSource] }}
            />
          )}
          {formatSourceName(tabSource)}
        </SettingsTabButton>
      ))}
    </div>
  );
}

function ConnectSourceLink({ source }) {
  function getSourceLink() {
    if (process.env.NODE_ENV === "development") {
      return `http://localhost:8888/auth/${source}/link`;
    }

    return `/auth/${source}/link`;
  }

  return (
    <a className={styles[`${source}Link`]} href={getSourceLink()}>
      {source !== "youtube" ? (
        <FontAwesomeIcon
          icon={ICONS[source]}
          style={{
            color: COLORS[source]
          }}
        />
      ) : (
        <YouTubeFullColorIcon />
      )}
      {`Connect ${formatSourceName(source)} Account`}
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
  usernameInput,
  original
}) {
  return (
    <label
      htmlFor="soundcloudURL"
      className={styles.soundcloudUsernameInputLabel}
    >
      <span>Enter your Soundcloud Profile URL</span>
      <div className={styles.inputAndButtonWrapper} style={{ display: "flex" }}>
        <input
          id="soundcloudURL"
          className={styles.soundcloudUsernameInput}
          type="text"
          placeholder="Enter Soundcloud Profile URL"
          onChange={handleInputChange}
          value={usernameInput}
        />
        <SubmitButton
          style={{ fontSize: "11px", padding: "8px", marginLeft: "auto" }}
          onClick={handleSubmitUsername}
          type="button" // Necessary to Prevent closing modal due to type submit
        >
          Submit
        </SubmitButton>
      </div>
    </label>
  );
}

export default SettingsForm;
