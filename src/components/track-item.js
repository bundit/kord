import React, { useState } from "react";
import LazyLoad from "react-lazyload";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEllipsisH } from "@fortawesome/free-solid-svg-icons";

import truncateString from "../utils/truncateString";
import msToDuration from "../utils/msToDuration";
import styles from "../styles/library.module.css";
import placeholderImg from "../assets/placeholder.png";

const TrackItem = ({
  title,
  img,
  artist,
  search,
  addToLibrary,
  ms,
  handlePlay
}) => {
  const [disable, setDisable] = useState(false);
  const handleDisable = () => {
    setDisable(true);
  };

  return (
    <LazyLoad height="5rem" once>
      <div
        className={styles.trackWrapper}
        onClick={handlePlay}
        role="button"
        tabIndex="0"
        onKeyPress={handlePlay}
      >
        <img
          src={img ? img.replace("large.jpg", "t67x67.jpg") : placeholderImg}
          alt="track"
        />
        <div className={styles.titleWrapper}>
          <div>
            <strong>{truncateString(title, 38)}</strong>
          </div>
          <div>{truncateString(artist, 38)}</div>
        </div>
        <div className={styles.trackRightControls}>
          <div className={styles.duration}>{msToDuration(ms)}</div>
          {search && (
            <button
              type="button"
              onClick={(event, track) => {
                addToLibrary(event, track);
                handleDisable();
              }}
              disabled={disable}
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
          )}
          {!search && (
            <button type="button" onClick={e => e.stopPropagation()}>
              <FontAwesomeIcon icon={faEllipsisH} />
            </button>
          )}
        </div>
      </div>
    </LazyLoad>
  );
};

TrackItem.propTypes = {
  title: PropTypes.string.isRequired,
  artist: PropTypes.string.isRequired,
  img: PropTypes.string,
  search: PropTypes.bool,
  addToLibrary: PropTypes.func,
  ms: PropTypes.number.isRequired,
  handlePlay: PropTypes.func.isRequired
};

TrackItem.defaultProps = {
  img: "",
  search: false,
  addToLibrary: () => {}
};

export default TrackItem;
