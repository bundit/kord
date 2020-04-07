import { connect } from "react-redux";
import PropTypes from "prop-types";
import React from "react";

import { loadMoreResults } from "../redux/actions/soundcloudActions";
import TrackList from "./track-list";

// For restoring scroll position when component is unmounted
let searchScrollPosition = null;

class Search extends React.Component {
  constructor(props) {
    super(props);

    this.handleAddToLibrary = this.handleAddToLibrary.bind(this);
    this.handlePlayTrack = this.handlePlayTrack.bind(this);
  }

  componentDidMount() {
    if (searchScrollPosition) {
      document.querySelector("html").scrollTop = searchScrollPosition;
    }
  }

  componentWillUnmount() {
    searchScrollPosition = document.querySelector("html").scrollTop;
  }

  handleAddToLibrary(event, track) {
    const { importSong } = this.props;

    importSong(track);

    // Prevent event bubbling to other handlers
    event.stopPropagation();
  }

  handleReset() {
    const { resetQuery } = this.props;
    resetQuery();
  }

  handlePlayTrack(track) {
    const { results, playTrack, setQueue } = this.props;
    let index = 0;

    // Find index of song clicked
    while (results[index].id !== track.id && index < results.length) {
      index += 1;
    }

    playTrack(track);

    // Set queue to remaining songs
    setQueue(results.slice(index));
  }

  render() {
    const { results, loadMoreTracks, isPlaying, currentTrackID } = this.props;
    const { handlePlayTrack, handleAddToLibrary } = this;

    return (
      <>
        <TrackList
          search
          library={results}
          handlePlay={handlePlayTrack}
          addToLibrary={handleAddToLibrary}
          loadMoreTracks={loadMoreTracks}
          currentTrackID={currentTrackID}
          isPlaying={isPlaying}
        />
      </>
    );
  }
}

Search.propTypes = {
  results: PropTypes.arrayOf(PropTypes.object).isRequired,
  // setSearchQuery: PropTypes.func.isRequired,
  playTrack: PropTypes.func.isRequired,
  importSong: PropTypes.func.isRequired,
  loadMoreTracks: PropTypes.func.isRequired,
  resetQuery: PropTypes.func.isRequired,
  setQueue: PropTypes.func.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  currentTrackID: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired
};

const mapStateToProps = state => ({
  results: state.search.results,
  history: state.search.history,
  currentTrackID: state.player.currentTrack.id,
  isPlaying: state.player.isPlaying,
  spotifyAccessToken: state.user.spotify.token
});

const mapDispatchToProps = dispatch => ({
  loadMoreTracks: () => dispatch(loadMoreResults()),
  importSong: track =>
    dispatch({
      type: "IMPORT_SONG",
      payload: track
    }),
  resetQuery: () =>
    dispatch({
      type: "RESET_SEARCH_QUERY"
    }),
  playTrack: track =>
    dispatch({
      type: "SET_TRACK",
      payload: track
    }),
  setQueue: list =>
    dispatch({
      type: "SET_QUEUE",
      payload: list
    })
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Search);
