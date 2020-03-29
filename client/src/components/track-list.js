import React from "react";
import PropTypes from "prop-types";
import { forceCheck } from "react-lazyload";

import TrackItem from "./track-item";
import styles from "../styles/library.module.css";

let trackListScrollPosition = null;

class TrackList extends React.Component {
  componentDidMount() {
    if (trackListScrollPosition) {
      window.scroll(0, trackListScrollPosition);
    }
  }

  componentDidUpdate(prevProps) {
    const { songs: currentLibrary } = this.props;
    const { songs: prevLibrary } = prevProps;

    // This will ensure that components that come into viewport during
    // a filter will be rendered. Lazyload only checks on scroll events,
    // so this way we force lazyload to check visible components
    if (currentLibrary !== prevLibrary) {
      forceCheck();
    }
  }

  componentWillUnmount() {
    trackListScrollPosition = window.scrollY;
  }

  render() {
    const {
      search,
      songs,
      handlePlay,
      addToLibrary,
      loadMoreTracks,
      currentTrackID,
      isPlaying,
      toggleAddToPlaylistForm,
      toggleEditTrackForm,
      toggleDeleteTrackForm
    } = this.props;

    return (
      <div className={styles.libraryWrapper}>
        {songs &&
          songs.map(track => (
            <TrackItem
              key={`${track.id}${track.source}`}
              track={track}
              search={search}
              handlePlay={() => handlePlay(track)}
              addToLibrary={event => addToLibrary(event, track)}
              isActive={currentTrackID === track.id}
              isPlaying={isPlaying}
              toggleAddToPlaylistForm={toggleAddToPlaylistForm}
              toggleEditTrackForm={toggleEditTrackForm}
              toggleDeleteTrackForm={toggleDeleteTrackForm}
            />
          ))}
        {search && songs.length > 0 && (
          <button type="button" onClick={loadMoreTracks}>
            Load More
          </button>
        )}
      </div>
    );
  }
}

TrackList.propTypes = {
  search: PropTypes.bool,
  songs: PropTypes.arrayOf(PropTypes.object),
  handlePlay: PropTypes.func,
  addToLibrary: PropTypes.func,
  loadMoreTracks: PropTypes.func,
  isPlaying: PropTypes.bool.isRequired,
  currentTrackID: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  toggleAddToPlaylistForm: PropTypes.func,
  toggleEditTrackForm: PropTypes.func,
  toggleDeleteTrackForm: PropTypes.func
};

TrackList.defaultProps = {
  search: false,
  songs: [],
  handlePlay: () => {},
  addToLibrary: () => {},
  loadMoreTracks: () => {},
  toggleAddToPlaylistForm: () => {},
  toggleEditTrackForm: () => {},
  toggleDeleteTrackForm: () => {}
};

export default TrackList;
