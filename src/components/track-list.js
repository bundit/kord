import React from "react";
import PropTypes from "prop-types";
import { forceCheck } from "react-lazyload";

import TrackItem from "./track-item";
import styles from "../styles/library.module.css";

class TrackList extends React.Component {
  componentDidUpdate(prevProps) {
    const { library: currentLibrary } = this.props;
    const { library: prevLibrary } = prevProps;

    if (currentLibrary !== prevLibrary) {
      forceCheck();
    }
  }

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

TrackList.propTypes = {
  library: PropTypes.arrayOf(PropTypes.object),
  handlePlay: PropTypes.func
};

TrackList.defaultProps = {
  library: [],
  handlePlay: () => {}
};

export default TrackList;
