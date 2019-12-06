import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";

import styles from "../styles/library.module.css";

const PlaylistItem = ({ title, length }) => (
  <Link to={`/library/playlists/${title}`} className={styles.trackWrapper}>
    <div className={styles.titleWrapper}>
      <div>
        <strong>{title}</strong>
      </div>
    </div>
    <div
      style={{
        marginLeft: "auto",
        display: "inherit",
        flexDirection: "inherit"
      }}
    >
      <span>{`${length} songs`}</span>
      <button type="button" onClick={e => e.preventDefault()}>
        <FontAwesomeIcon icon={faEllipsisV} />
      </button>
    </div>
  </Link>
);

PlaylistItem.propTypes = {
  title: PropTypes.string.isRequired,
  length: PropTypes.number.isRequired
};

export default PlaylistItem;
