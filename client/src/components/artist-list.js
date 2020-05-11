import PropTypes from "prop-types";
import React, { useEffect } from "react";

import { formatArtistName } from "../utils/formattingHelpers";
import ArtistItem from "./artist-item";
import styles from "../styles/library.module.css";

let artistListScrollPosition = null;

const ArtistList = ({ artists }) => {
  // Save or restore scroll position
  useEffect(() => {
    if (artistListScrollPosition) {
      window.scrollTo(0, artistListScrollPosition);
    }

    return () => {
      artistListScrollPosition = window.scrollY;
    };
  }, []);

  return (
    <div className={styles.libraryWrapper}>
      {artists.map(artist => (
        <ArtistItem
          key={`${formatArtistName(artist)} ${artist.id || artist[0].id}`}
          artist={artist}
        />
      ))}
    </div>
  );
};

ArtistList.propTypes = {
  artists: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.shape({ name: PropTypes.string.isRequired }),
      PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string.isRequired }))
    ])
  ).isRequired
};

export default ArtistList;
