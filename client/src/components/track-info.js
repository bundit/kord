import { Link } from "react-router-dom";
import React from "react";

import libraryStyles from "../styles/library.module.css";
import playerStyles from "../styles/player.module.css";

const TrackInfo = ({ track, isPlayer }) => {
  const artistNames = Array.isArray(track.artist)
    ? track.artist.map(a => a.name)
    : [track.artist.name];

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
        {artistNames.map((artistName, i) => (
          <React.Fragment key={artistName}>
            <Link
              className={`${libraryStyles.stackedArtistName}`}
              to={`/app/search/${encodeURIComponent(artistName)}`}
            >
              {artistName}
            </Link>
            {i < artistNames.length - 1 && ", "}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default TrackInfo;
