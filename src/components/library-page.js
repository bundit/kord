import React from "react";
import PropTypes from "prop-types";
import { Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import SearchBar from "./search-bar";
import PlaylistForm from "./playlist-form";
import LibrarySectionList from "./library-category-list";
import TrackList from "./track-list";
import ArtistList from "./artist-list";
import ListOfPlaylists from "./playlist-list";
import { importScLikes } from "../redux/actions/libraryActions";
import fadeTransition from "../styles/fade.module.css";

// For restoring scroll position when component is unmounted
let libraryScrollPosition = null;

class Library extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handlePlayTrack = this.handlePlayTrack.bind(this);
    this.handleNewPlaylist = this.handleNewPlaylist.bind(this);
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

  handleNewPlaylist(e) {
    const {
      newPlaylistName,
      createNewPlaylist,
      togglePlaylistForm,
      setNewPlaylistName
    } = this.props;

    createNewPlaylist(newPlaylistName);
    togglePlaylistForm();
    setNewPlaylistName("");

    e.preventDefault();
  }

  render() {
    const categories = ["Playlists", "Artists", "Songs", "Albums", "Genres"];
    let { library, query } = this.props;
    const {
      artists,
      playlists,
      currentTrackID,
      isPlaying,
      isPlaylistFormOpen,
      newPlaylistName,
      togglePlaylistForm,
      setNewPlaylistName
    } = this.props;
    const {
      handleChange,
      handleSubmit,
      handleReset,
      handlePlayTrack,
      handleNewPlaylist
    } = this;

    query = query.toLowerCase();

    if (query && query.length >= 3) {
      const filteredSongs = library.filter(
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
        <PlaylistForm
          show={isPlaylistFormOpen}
          value={newPlaylistName}
          onChange={setNewPlaylistName}
          onSubmit={handleNewPlaylist}
          onClose={togglePlaylistForm}
        />
        <Route
          render={({ location }) => {
            const { pathname } = location;
            return (
              <TransitionGroup>
                <CSSTransition
                  key={pathname}
                  classNames={fadeTransition}
                  timeout={{
                    enter: 300,
                    exit: 0
                  }}
                >
                  <Route
                    location={location}
                    render={() => (
                      <Switch>
                        <Route
                          exact
                          path="/library"
                          render={() => (
                            <LibrarySectionList categories={categories} />
                          )}
                        />
                        <Route
                          exact
                          path="/library/songs"
                          render={() => (
                            <TrackList
                              library={library}
                              handlePlay={handlePlayTrack}
                              currentTrackID={currentTrackID}
                              isPlaying={isPlaying}
                            />
                          )}
                        />
                        <Route
                          exact
                          path="/library/artists"
                          render={() => <ArtistList artists={artists} />}
                        />
                        <Route
                          path="/library/artists/:artist"
                          render={props => (
                            <TrackList
                              library={library.filter(
                                song =>
                                  song.artist.name === props.match.params.artist
                              )}
                              handlePlay={handlePlayTrack}
                              currentTrackID={currentTrackID}
                              isPlaying={isPlaying}
                            />
                          )}
                        />
                        <Route
                          exact
                          path="/library/playlists"
                          render={() => (
                            <ListOfPlaylists
                              handleNewPlaylist={handleNewPlaylist}
                              playlists={playlists}
                              togglePlaylistForm={togglePlaylistForm}
                            />
                          )}
                        />
                        {/* <Route component={<404 Placeholder />} /> */}
                      </Switch>
                    )}
                  />
                </CSSTransition>
              </TransitionGroup>
            );
          }}
        />
      </>
    );
  }
}

Library.propTypes = {
  query: PropTypes.string,
  library: PropTypes.arrayOf(PropTypes.object).isRequired,
  artists: PropTypes.arrayOf(PropTypes.object).isRequired,
  playTrack: PropTypes.func.isRequired,
  setLibQuery: PropTypes.func.isRequired,
  setQueue: PropTypes.func.isRequired,
  resetQuery: PropTypes.func.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  currentTrackID: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  createNewPlaylist: PropTypes.func.isRequired,
  playlists: PropTypes.PropTypes.arrayOf(PropTypes.object).isRequired,
  isPlaylistFormOpen: PropTypes.bool.isRequired,
  newPlaylistName: PropTypes.string,
  togglePlaylistForm: PropTypes.func.isRequired,
  setNewPlaylistName: PropTypes.func.isRequired
};

Library.defaultProps = {
  query: "",
  newPlaylistName: ""
};

const mapStateToProps = state => ({
  library: state.music.library,
  playlists: state.music.playlists,
  artists: state.music.artists,
  query: state.music.query,
  currentTrackID: state.musicPlayer.currentTrack.id,
  isPlaying: state.musicPlayer.isPlaying,
  isPlaylistFormOpen: state.music.isPlaylistFormOpen,
  newPlaylistName: state.music.newPlaylistName
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
  togglePlaylistForm: () =>
    dispatch({
      type: "TOGGLE_PLAYLIST_FORM"
    }),
  setNewPlaylistName: name =>
    dispatch({
      type: "SET_NEW_PLAYLIST_NAME",
      payload: name
    }),
  createNewPlaylist: name =>
    dispatch({
      type: "CREATE_NEW_PLAYLIST",
      payload: name
    }),
  dispatch
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Library);
