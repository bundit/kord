import React from "react";
import PropTypes from "prop-types";

import styles from "../styles/library.module.css";
import ArtistItem from "./artist-item";

const ArtistList = ({ artists }) => (
  <div className={styles.libraryWrapper}>
    {artists.map(artist => (
      <ArtistItem key={artist.name} artist={artist} />
    ))}
  </div>
);

export default ArtistList;
