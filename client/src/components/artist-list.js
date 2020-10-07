import PropTypes from "prop-types";
import React, { useState } from "react";

import { formatArtistName } from "../utils/formattingHelpers";
import ArtistItem from "./artist-item";
import styles from "../styles/library.module.css";

const ArtistList = ({ artists, source }) => {
  const defaultShowValue = 1;
  const [showAll, setShowAll] = useState(false);
  const [numShown, setNumShown] = useState(defaultShowValue);

  function handleShowMore() {
    setShowAll(true);
    setNumShown(artists.length);
  }

  function handleShowLess() {
    setShowAll(false);
    setNumShown(defaultShowValue);
  }

  const artistItems = artists
    .slice(0, numShown)
    .map(artist => (
      <ArtistItem
        key={`${formatArtistName(artist)} ${artist.id || artist[0].id}`}
        artist={artist}
        source={source}
      />
    ));

  const hasMoreArtistToShow = defaultShowValue < artists.length;
  const resultsLeft = artists.length - defaultShowValue;

  return (
    <>
      {artistItems}
      {hasMoreArtistToShow && (
        <button
          className={`${styles.artistWrapper} ${styles.artistShowMoreLessButton} ${styles.artistLink}`}
          onClick={showAll ? handleShowLess : handleShowMore}
          key={`${source}:showlessmore`}
        >
          <div
            className={`${styles.artistImage} ${styles.showMoreLessCircle}`}
            style={{
              border: `1px ${colors[source]}40 solid`,
              color: colors[source]
            }}
          >
            <span>{showAll ? "Show Less" : "Show More"}</span>
          </div>
          {!showAll && (
            <div className={styles.artistName}>{`${resultsLeft} more result${
              resultsLeft > 1 ? "s" : ""
            }`}</div>
          )}
        </button>
      )}
    </>
  );
};

const colors = {
  spotify: "#1db954",
  soundcloud: "#ff5500",
  youtube: "#ff0000",
  mixcloud: "#5000ff"
};

ArtistList.propTypes = {
  artists: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.shape({ name: PropTypes.string.isRequired }),
      PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string.isRequired }))
    ])
  )
};

ArtistList.defaultProps = {
  artists: []
};

export default ArtistList;
