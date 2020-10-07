import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import {
  faSpotify,
  faSoundcloud,
  faYoutube,
  faMixcloud
} from "@fortawesome/free-brands-svg-icons";
import LazyLoad from "react-lazyload";
import PropTypes from "prop-types";
import React from "react";

import { formatArtistName } from "../utils/formattingHelpers";
import { getImgUrl } from "../utils/getImgUrl";
import avatarImg from "../assets/avatar-placeholder.png";
import styles from "../styles/library.module.css";

const ArtistItem = ({ artist }) => {
  const artistName = formatArtistName(artist);
  const { source, id, name } = artist;

  return (
    <div style={{ position: "relative" }}>
      <Link
        to={`/app/search/artist/${source}/${id}/${encodeURIComponent(name)}`}
        className={styles.artistLink}
      >
        <div className={styles.artistWrapper}>
          <div
            className={`${styles.artistImage}`}
            style={{ color: `${colors[source]}` }}
          >
            <img src={getImgUrl(artist, "md")} alt={artistName} />
          </div>

          <div className={styles.artistName}>{artistName}</div>
        </div>
        <div
          className={styles.artistSourceIcon}
          style={{ color: colors[source] }}
        >
          <FontAwesomeIcon icon={icons[source]} />
        </div>
      </Link>
    </div>
  );
};

const icons = {
  spotify: faSpotify,
  soundcloud: faSoundcloud,
  youtube: faYoutube,
  mixcloud: faMixcloud
};

const colors = {
  spotify: "#1db954",
  soundcloud: "#ff5500",
  youtube: "#ff0000",
  mixcloud: "#5000ff"
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
    img: avatarImg
  }
};

export default ArtistItem;
