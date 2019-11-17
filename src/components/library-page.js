import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import SearchBar from "./search-bar";
import TrackList from "./track-list";
import { importScLikes } from "../redux/actions/libraryActions";

// For restoring scroll position when component is unmounted
let libraryScrollPosition = null;

class Library extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handlePlayTrack = this.handlePlayTrack.bind(this);
  }

  componentDidMount() {
    if (libraryScrollPosition) {
      document.querySelector("html").scrollTop = libraryScrollPosition;
    }
    // this.props.importScLikes("bundit");
  }

  componentWillUnmount() {
    libraryScrollPosition = document.querySelector("html").scrollTop;
  }

  handleChange(event) {
    const { setLibQuery } = this.props;
    setLibQuery(event.target.value);
  }

  handleReset() {
    const { resetQuery } = this.props;
    resetQuery();
  }

  handlePlayTrack(track) {
    const { library, playTrack, setQueue } = this.props;
    let index = 0;

    // Find index of song clicked
    while (library[index].id !== track.id && index < library.length) {
      index += 1;
    }

    playTrack(track);

    // Set the queue to the remaining songs
    setQueue(library.slice(index));
  }

  handleSubmit(event) {
    // const { query, dispatchSearchLibrary } = this.props;

    // dispatchSearchLibrary(query);

    event.preventDefault();
  }

  render() {
    // const { query  } = this.props;
    let { query, library } = this.props;
    const { handleChange, handleSubmit, handleReset, handlePlayTrack } = this;

    query = query.toLowerCase();

    if (query && query.length >= 3) {
      library = library.filter(
        ({ title, artist }) =>
          title.toLowerCase().includes(query) ||
          artist.name.toLowerCase().includes(query)
      );
    }

    return (
      <>
        <SearchBar
          placeholder="Search Library"
          query={query}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onReset={handleReset}
        />
        <TrackList library={library} handlePlay={handlePlayTrack} />
      </>
    );
  }
}

Library.propTypes = {
  query: PropTypes.string,
  library: PropTypes.arrayOf(PropTypes.object).isRequired,
  playTrack: PropTypes.func.isRequired,
  setLibQuery: PropTypes.func.isRequired,
  setQueue: PropTypes.func.isRequired,
  resetQuery: PropTypes.func.isRequired
};

Library.defaultProps = {
  query: ""
};

const mapStateToProps = state => ({
  library: state.music.library,
  query: state.music.query
});

const mapDispatchToProps = dispatch => ({
  importScLikes: user => dispatch(importScLikes(user)),
  setLibQuery: query =>
    dispatch({
      type: "SET_LIB_QUERY",
      payload: query
    }),
  resetQuery: () =>
    dispatch({
      type: "RESET_LIB_QUERY"
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
    }),
  dispatch
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Library);
