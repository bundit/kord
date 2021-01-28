import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import React from "react";

import { COLORS, ICONS } from "../utils/constants";
import { formatArtistName } from "../utils/formattingHelpers";
import { getImgUrl } from "../utils/getImgUrl";
import avatarImg from "../assets/avatar-placeholder.png";
import styles from "../styles/artist-item.module.scss";

const ArtistItem = ({ artist }) => {
  const artistName = formatArtistName(artist);
  const { source, id, name } = artist;

  function getArtistHref() {
    return `/app/search/artist/${source}/${encodeURIComponent(
      id
    )}/${encodeURIComponent(name)}`;
  }

  return (
    <div style={{ position: "relative" }}>
      <Link to={getArtistHref()} className={styles.artistLink}>
        <div className={styles.artistWrapper}>
          <div
            className={`${styles.artistImage}`}
            style={{ color: `${COLORS[source]}80` }}
          >
            <img src={getImgUrl(artist, "md")} alt={artistName} />
          </div>

          <div className={styles.artistName}>{artistName}</div>
        </div>
        <div
          className={styles.artistSourceIcon}
          style={{ color: COLORS[source] }}
        >
          <FontAwesomeIcon icon={ICONS[source]} />
        </div>
      </Link>
    </div>
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
    img: avatarImg
  }
};

export default ArtistItem;
