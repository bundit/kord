import React from "react";
import PropTypes from "prop-types";
import LazyLoad from "react-lazyload";

import styles from "../styles/library.module.css";
import placeholderImg from "../assets/placeholder.png";

const ArtistItem = ({ artist: { name, img, id } }) => (
  <LazyLoad height="5rem" once>
    <div className={styles.trackWrapper} role="button" tabIndex="0">
      <div className={styles.trackImageWrap}>
        <img
          className={styles.artistImage}
          src={img || placeholderImg}
          alt={name}
          onError={e => {
            // This function ensures that if there is a 404 on the image,
            // then the placeholder will be used
            e.target.onerror = null;
            e.target.src = placeholderImg;
          }}
        />
      </div>

      <div className={styles.titleWrapper}>
        <div>
          <strong>{name}</strong>
        </div>
      </div>
    </div>
  </LazyLoad>
);

export default ArtistItem;
