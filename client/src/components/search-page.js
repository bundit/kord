import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import {
  searchSouncloudTracks,
  searchSoundcloudArtists,
  loadMoreResults
} from "../redux/actions/searchActions";
import SearchBar from "./search-bar";
import TrackList from "./track-list";

// For restoring scroll position when component is unmounted
let searchScrollPosition = null;

class Search extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAddToLibrary = this.handleAddToLibrary.bind(this);
    this.handleReset = this.handleReset.bind(this);
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

  handleChange(event) {
    const { setSearchQuery } = this.props;

    setSearchQuery(event.target.value);
  }

  async handleSubmit(event) {
    const { query, searchScTracks, searchScArtists } = this.props;

    searchScTracks(query);
    searchScArtists(query);

    event.preventDefault();
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
    const {
      query,
      results,
      loadMoreTracks,
      isPlaying,
      currentTrackID
    } = this.props;
    const {
      handleChange,
      handleSubmit,
      handleReset,
      handlePlayTrack,
      handleAddToLibrary
    } = this;

    return (
      <>
        <SearchBar
          placeholder="Search for Music"
          query={query}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onReset={handleReset}
        />
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
  query: PropTypes.string.isRequired,
  results: PropTypes.arrayOf(PropTypes.object).isRequired,
  setSearchQuery: PropTypes.func.isRequired,
  playTrack: PropTypes.func.isRequired,
  importSong: PropTypes.func.isRequired,
  loadMoreTracks: PropTypes.func.isRequired,
  searchScTracks: PropTypes.func.isRequired,
  searchScArtists: PropTypes.func.isRequired,
  resetQuery: PropTypes.func.isRequired,
  setQueue: PropTypes.func.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  currentTrackID: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired
};

const mapStateToProps = state => ({
  query: state.search.query,
  results: state.search.results,
  history: state.search.history,
  currentTrackID: state.musicPlayer.currentTrack.id,
  isPlaying: state.musicPlayer.isPlaying
});

const mapDispatchToProps = dispatch => ({
  searchScTracks: query => {
    dispatch(searchSouncloudTracks(query));
  },
  searchScArtists: query => {
    dispatch(searchSoundcloudArtists(query));
  },
  loadMoreTracks: () => dispatch(loadMoreResults()),
  setSearchQuery: query =>
    dispatch({
      type: "SET_SEARCH_QUERY",
      query
    }),
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
