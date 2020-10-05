import { Link } from "react-router-dom";
import React from "react";

import libraryStyles from "../styles/library.module.css";
import playerStyles from "../styles/player.module.css";

const TrackInfo = ({ track, isPlayer }) => {
  const artists = Array.isArray(track.artist) ? track.artist : [track.artist];

  const styles = isPlayer ? playerStyles : libraryStyles;

  return (
    <div className={styles.titleWrapper}>
      {isPlayer ? (
        <div className={styles.nowPlayingTitle}>{track.title}</div>
      ) : (
        <div styles={styles.nowPlayingTitle}>
          <strong>{track.title}</strong>
        </div>
      )}
      <div>
        {track.artist &&
          artists.map((artist, i) => (
            <React.Fragment key={artist.name}>
              <Link
                className={`${libraryStyles.stackedArtistName}`}
                to={`/app/search/artist/${track.source}/${
                  artist.id
                }/${encodeURIComponent(artist.name)}`}
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
