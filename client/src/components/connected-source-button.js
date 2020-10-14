import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

import styles from "../styles/sidebar.module.scss";

const ConnectedSourceButton = ({ isConnected, openSettings, source, icon }) => {
  function handleClick() {
    openSettings(source);
  }

  return (
    <button
      className={`${styles.sourceButton} ${isConnected &&
        styles.connectedSource}`}
      type="button"
      onClick={handleClick}
    >
      <FontAwesomeIcon size="6x" icon={icon} />
    </button>
  );
};

export default ConnectedSourceButton;
