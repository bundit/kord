import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

import { ReactComponent as YouTubeIconFullColorIcon } from "../assets/youtube-icon-full-color.svg";
import { capitalizeWord } from "../utils/formattingHelpers";
import styles from "../styles/sidebar.module.scss";

const ConnectedSourceButton = ({ isConnected, openSettings, source, icon }) => {
  function handleClick() {
    openSettings(source);
  }

  // Need to show full color youtube icon when connected due to youtube branding guidelines
  const isNotYoutubeOrNotConnected = source !== "youtube" || !isConnected;

  return (
    <button
      className={`${styles.sourceButton} ${isConnected &&
        styles[`connected${capitalizeWord(source)}`]}`}
      type="button"
      onClick={handleClick}
    >
      {isNotYoutubeOrNotConnected ? (
        <FontAwesomeIcon size="6x" icon={icon} />
      ) : (
        <YouTubeIconFullColorIcon />
      )}
    </button>
  );
};

export default ConnectedSourceButton;
