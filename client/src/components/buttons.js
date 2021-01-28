import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";
import React from "react";

import { COLORS, ICONS } from "../utils/constants";
import { ReactComponent as YouTubeFullColorIcon } from "../assets/youtube-icon-full-color.svg";
import { formatSourceName } from "../utils/formattingHelpers";
import styles from "../styles/button.module.scss";

export const Button = props => (
  <button
    type="button"
    {...props}
    className={`${styles.button} ${props.className}`}
  >
    {props.children}
  </button>
);

export const SubmitButton = props => (
  <Button
    {...props}
    className={`${styles.primaryButton} ${props.className}`}
    type="submit"
  />
);

export const CancelButton = props => (
  <Button {...props} className={styles.cancelButton}>
    Cancel
  </Button>
);

export const DangerousButton = props => (
  <Button {...props} className={styles.dangerousButton} />
);

export const SourceSearchButton = ({ source, isSearched, ...props }) => {
  // Need to show youtube full color icon on searched due to youtube branding guidelines, monochrome is fine
  const notYoutubeOrHasntSearchedYoutube = source !== "youtube" || !isSearched;
  return (
    <Button
      {...props}
      className={`${styles.searchSourceButton} ${
        styles[`${source}SearchButton`]
      }`}
    >
      {notYoutubeOrHasntSearchedYoutube ? (
        <FontAwesomeIcon
          icon={ICONS[source]}
          style={{
            color: isSearched ? COLORS[source] : null
          }}
          size="lg"
        />
      ) : (
        <span className={styles.youtubeSearchedIcon}>
          <YouTubeFullColorIcon />
        </span>
      )}
      {isSearched ? ` Hide` : ` Show`} {formatSourceName(source)}{" "}
    </Button>
  );
};
export const SettingsTabButton = ({ isActive, ...props }) => (
  <Button
    {...props}
    className={`${styles.settingsTabButton} ${
      styles[`${props.source}Tab`]
    } ${isActive && styles.activeTab}`}
  />
);

export const ShowMoreResultsButton = props => (
  <Button {...props} className={styles.showMoreResultsButton} />
);

export const IconButton = ({ className, icon, size, children, ...props }) => (
  <Button {...props} className={`${styles.iconButton} ${className}`}>
    {icon && <FontAwesomeIcon icon={icon} size={size} />}
    {children}
  </Button>
);

export const LargeIconButton = ({ icon, ...props }) => (
  <Button {...props} className={styles.largeIconButton}>
    {<FontAwesomeIcon size="2x" icon={icon} />}
  </Button>
);

export const PlayPauseButton = ({ isPlaying, size, ...props }) => (
  <Button {...props} className={styles.playPauseButton}>
    <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} size={size || "2x"} />
  </Button>
);

export const LargePlayPauseButton = ({ isPlaying, ...props }) => (
  <Button {...props} className={styles.largePlayPauseButton}>
    <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
  </Button>
);

export const ClearQueueButton = props => (
  <Button {...props} className={styles.clearQueueButton}>
    Clear
  </Button>
);
