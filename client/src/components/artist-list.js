import React, { useEffect } from "react";
import PropTypes from "prop-types";

import styles from "../styles/library.module.css";
import ArtistItem from "./artist-item";

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
    <div className={styles.libraryWrapper} zindex="1">
      {artists.map(artist => (
        <ArtistItem key={artist.name} artist={artist} />
      ))}
    </div>
  );
};

ArtistList.propTypes = {
  artists: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      img: PropTypes.string
    })
  ).isRequired
};

export default ArtistList;
