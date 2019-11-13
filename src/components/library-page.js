import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import SearchBar from "./search-bar";
import TrackItem from "./track-item";
import { importScLikes } from "../redux/actions/libraryActions";
import styles from "../styles/library.module.css";

// For restoring scroll position when component is unmounted
let libraryScrollPosition = null;

class Library extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
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
    const { dispatchSetLibQuery } = this.props;
    dispatchSetLibQuery(event.target.value);
  }

  handleReset() {
    const { dispatchResetQuery } = this.props;

    dispatchResetQuery();
  }

  handleSubmit(event) {
    // const { query, dispatchSearchLibrary } = this.props;

    // dispatchSearchLibrary(query);

    event.preventDefault();
  }

  render() {
    // const { query  } = this.props;
    let { query, library } = this.props;
    const { handleChange, handleSubmit, handleReset } = this;

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
              />
            ))}
        </div>
      </>
    );
  }
}

Library.propTypes = {
  query: PropTypes.string,
  library: PropTypes.arrayOf(PropTypes.object).isRequired,
  dispatchSetLibQuery: PropTypes.func.isRequired,
  dispatchResetQuery: PropTypes.func.isRequired
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
  dispatchSetLibQuery: query =>
    dispatch({
      type: "SET_LIB_QUERY",
      payload: query
    }),
  dispatchResetQuery: () =>
    dispatch({
      type: "RESET_LIB_QUERY"
    }),
  dispatch
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Library);
