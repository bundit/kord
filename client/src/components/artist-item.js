import React from "react";
import PropTypes from "prop-types";
import LazyLoad from "react-lazyload";
import { Link } from "react-router-dom";

import styles from "../styles/library.module.css";
import placeholderImg from "../assets/placeholder.png";

const ArtistItem = ({ artist: { name, img } }) => (
  <LazyLoad height="5rem" once>
    <Link to={`/library/artists/${name}`} className={styles.trackWrapper}>
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
    </Link>
  </LazyLoad>
);

ArtistItem.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  artist: PropTypes.shape({
    name: PropTypes.string.isRequired,
    img: PropTypes.string
  })
};

ArtistItem.defaultProps = {
  artist: {
    img: placeholderImg
  }
};

export default ArtistItem;
