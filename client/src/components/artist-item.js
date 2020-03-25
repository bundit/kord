import React from "react";
import PropTypes from "prop-types";
import LazyLoad from "react-lazyload";
import { Link } from "react-router-dom";

import styles from "../styles/library.module.css";
import placeholderImg from "../assets/placeholder.png";

const ArtistItem = ({ artist: { name, img } }) => (
  <Link to={`/app/library/artists/${name}`} className={styles.artistLink}>
    <div className={styles.relativeWrapper}>
      <LazyLoad height={60} overflow={true}>
        <div className={styles.trackWrapper}>
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
            <div>{name}</div>
          </div>
        </div>
      </LazyLoad>
    </div>
  </Link>
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
