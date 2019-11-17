import React from "react";

import TrackItem from "./track-item";
import styles from "../styles/library.module.css";

class TrackList extends React.Component {
  render() {
    const { library, handlePlay } = this.props;

    return (
      <div id="lib" className={styles.libraryWrapper}>
        {library &&
          library.map(track => (
            <TrackItem
              key={track.id}
              img={track.img}
              title={track.title}
              artist={track.artist.name}
              id={track.id}
              ms={track.duration}
              handlePlay={() => handlePlay(track)}
            />
          ))}
      </div>
    );
  }
}

export default TrackList;
