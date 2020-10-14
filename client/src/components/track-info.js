import { Link } from "react-router-dom";
import React from "react";

import styles from "../styles/track-item.module.scss";

const TrackInfo = ({ track, isPlayer, isForm, handleArtistClick }) => {
  const artists = Array.isArray(track.artist) ? track.artist : [track.artist];

  return (
    <div
      className={`${styles.titleWrapper} ${isForm && styles.formTrackTitle}`}
    >
      {isPlayer ? (
        <div>{track.title}</div>
      ) : (
        <div>
          <strong>{track.title}</strong>
        </div>
      )}
      <div>
        {track.artist &&
          artists.map((artist, i) => (
            <React.Fragment key={artist.name}>
              <Link
                className={`${styles.stackedArtistName}`}
                to={`/app/search/artist/${track.source}/${
                  artist.id
                }/${encodeURIComponent(artist.name)}`}
                onClick={handleArtistClick}
              >
                {artist.name}
              </Link>
              {i < artists.length - 1 && ", "}
            </React.Fragment>
          ))}
      </div>
    </div>
  );
};

export default TrackInfo;
