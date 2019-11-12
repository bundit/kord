import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEllipsisH } from "@fortawesome/free-solid-svg-icons";

import truncateString from "../utils/truncateString";
import msToDuration from "../utils/msToDuration";
import styles from "../styles/library.module.css";
import placeholderImg from "../assets/placeholder.png";

const TrackItem = ({ title, img, artist, search, addToLibrary, ms }) => (
  <div className={styles.trackWrapper}>
    <img src={img || placeholderImg} alt="track" />
    <div className={styles.titleWrapper}>
      <div>
        <strong>{truncateString(title, 38)}</strong>
      </div>
      <div>{truncateString(artist, 38)}</div>
    </div>
    <div className={styles.trackRightControls}>
      <div className={styles.duration}>{msToDuration(ms)}</div>
      {search && (
        <button type="button" onClick={addToLibrary}>
          <FontAwesomeIcon icon={faPlus} />
        </button>
      )}
      {!search && (
        <button type="button">
          <FontAwesomeIcon icon={faEllipsisH} />
        </button>
      )}
    </div>
  </div>
);

TrackItem.propTypes = {
  title: PropTypes.string.isRequired,
  artist: PropTypes.string.isRequired,
  img: PropTypes.string,
  search: PropTypes.bool,
  addToLibrary: PropTypes.func,
  ms: PropTypes.number.isRequired
};

TrackItem.defaultProps = {
  img: "",
  search: false,
  addToLibrary: () => {}
};

export default TrackItem;
