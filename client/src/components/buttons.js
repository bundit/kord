import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

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

export const SourceSearchButton = props => (
  <Button
    {...props}
    className={`${styles.searchSourceButton} ${
      styles[`${props.source}SearchButton`]
    }`}
  />
);

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

export const IconButton = ({ icon, size, children, ...props }) => (
  <Button {...props} className={styles.iconButton}>
    {icon && <FontAwesomeIcon icon={icon} size={size} />}
    {children}
  </Button>
);

export const LargeIconButton = ({ icon, ...props }) => (
  <Button {...props} className={styles.largeIconButton}>
    <FontAwesomeIcon size="2x" icon={icon} />
  </Button>
);
