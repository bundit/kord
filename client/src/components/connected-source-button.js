import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

import styles from "../styles/sidebar.module.css";

const ConnectedSourceButton = ({
  isConnected,
  handleClick,
  handleConnectSource,
  handleHover,
  source,
  icon
}) => (
  <button
    className={`${isConnected && styles.connectedSource}`}
    type="button"
    onMouseEnter={isConnected ? () => handleHover(source) : null}
    onClick={
      isConnected
        ? () => handleClick(source)
        : () => handleConnectSource(source)
    }
  >
    <FontAwesomeIcon size="6x" icon={icon} />
  </button>
);

export default ConnectedSourceButton;
