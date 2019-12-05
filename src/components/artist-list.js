import React from "react";
import PropTypes from "prop-types";

import styles from "../styles/library.module.css";
import ArtistItem from "./artist-item";

const ArtistList = ({ artists }) => (
  <div className={styles.libraryWrapper} zIndex="1">
    {artists.map(artist => (
      <ArtistItem key={artist.name} artist={artist} />
    ))}
  </div>
);

ArtistList.propTypes = {
  artists: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      img: PropTypes.string
    })
  ).isRequired
};

export default ArtistList;
