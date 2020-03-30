import { Link } from "react-router-dom";
import LazyLoad from "react-lazyload";
import PropTypes from "prop-types";
import React from "react";

import { formatArtistName } from "../utils/formatArtistName";
import placeholderImg from "../assets/placeholder.png";
import styles from "../styles/library.module.css";

const ArtistItem = ({ artist }) => {
  const { img } = artist;
  const artistName = formatArtistName(artist);

  return (
    <Link
      to={`/app/library/artists/${artistName}`}
      className={styles.artistLink}
    >
      <div className={styles.relativeWrapper}>
        <LazyLoad height={60} overflow={true}>
          <div className={styles.trackWrapper}>
            <div className={styles.trackImageWrap}>
              <img
                className={styles.artistImage}
                src={img || placeholderImg}
                alt={artistName}
                onError={e => {
                  // This function ensures that if there is a 404 on the image,
                  // then the placeholder will be used
                  e.target.onerror = null;
                  e.target.src = placeholderImg;
                }}
              />
            </div>

            <div className={styles.titleWrapper}>
              <div>{artistName}</div>
            </div>
          </div>
        </LazyLoad>
      </div>
    </Link>
  );
};

ArtistItem.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  artist: PropTypes.oneOfType([
    PropTypes.shape({ name: PropTypes.string.isRequired }),
    PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string.isRequired }))
  ]).isRequired
};

ArtistItem.defaultProps = {
  artist: {
    img: placeholderImg
  }
};

export default ArtistItem;
