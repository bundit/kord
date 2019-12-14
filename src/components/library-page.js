import React from "react";
import PropTypes from "prop-types";
import { Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import SearchBar from "./search-bar";
import NewPlaylistForm from "./new-playlist-form";
import AddToPlaylistForm from "./add-to-playlist-form";
import EditTrackForm from "./edit-track-form";
import DeleteTrackForm from "./delete-track-form";
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
    this.handleSubmitAddToPlaylists = this.handleSubmitAddToPlaylists.bind(
      this
    );
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
      toggleNewPlaylistForm,
      setNewPlaylistName
    } = this.props;

    createNewPlaylist(newPlaylistName);
    toggleNewPlaylistForm();
    setNewPlaylistName("");

    e.preventDefault();
  }

  handleSubmitAddToPlaylists(playlists) {
    const { addToPlaylists, toggleAddToPlaylistForm } = this.props;

    addToPlaylists(playlists);
    toggleAddToPlaylistForm();
  }

  render() {
    const categories = ["Playlists", "Artists", "Songs", "Albums", "Genres"];
    let { library, query } = this.props;
    const {
      artists,
      playlists,
      currentTrackID,
      isPlaying,
      isNewPlaylistFormOpen,
      newPlaylistName,
      toggleNewPlaylistForm,
      setNewPlaylistName,
      toggleAddToPlaylistForm,
      isAddToPlaylistFormOpen,
      trackDropdownSelected,
      isEditTrackFormOpen,
      toggleEditTrackForm,
      submitTrackEdit,
      isDeleteTrackFormOpen,
      toggleDeleteTrackForm,
      submitDeleteTrack
    } = this.props;
    const {
      handleChange,
      handleSubmit,
      handleReset,
      handlePlayTrack,
      handleNewPlaylist,
      handleSubmitAddToPlaylists
    } = this;

    query = query.toLowerCase();

    // TODO: create new filtering for songs and artist view
    // if (query && query.length >= 3) {
    //   const filteredSongs = library.filter(
    //     ({ title, artist }) =>
    //       title.toLowerCase().includes(query) ||
    //       artist.name.toLowerCase().includes(query)
    //   );
    // }

    return (
      <>
        <SearchBar
          placeholder="Search Library"
          query={query}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onReset={handleReset}
        />
        <NewPlaylistForm
          show={isNewPlaylistFormOpen}
          value={newPlaylistName}
          onChange={setNewPlaylistName}
          onSubmit={handleNewPlaylist}
          onClose={toggleNewPlaylistForm}
        />
        <AddToPlaylistForm
          show={isAddToPlaylistFormOpen}
          playlistTitles={Object.keys(playlists)}
          onSubmit={handleSubmitAddToPlaylists}
          onClose={toggleAddToPlaylistForm}
        />
        <EditTrackForm
          show={isEditTrackFormOpen}
          track={trackDropdownSelected}
          onSubmit={submitTrackEdit}
          onClose={toggleEditTrackForm}
        />
        <DeleteTrackForm
          show={isDeleteTrackFormOpen}
          onSubmit={submitDeleteTrack}
          track={trackDropdownSelected}
          onClose={toggleDeleteTrackForm}
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
                              toggleAddToPlaylistForm={toggleAddToPlaylistForm}
                              toggleEditTrackForm={toggleEditTrackForm}
                              toggleDeleteTrackForm={toggleDeleteTrackForm}
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
                              toggleAddToPlaylistForm={toggleAddToPlaylistForm}
                              toggleEditTrackForm={toggleEditTrackForm}
                              toggleDeleteTrackForm={toggleDeleteTrackForm}
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
                              toggleNewPlaylistForm={toggleNewPlaylistForm}
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
  // eslint-disable-next-line
  playlists: PropTypes.object.isRequired,
  isNewPlaylistFormOpen: PropTypes.bool,
  newPlaylistName: PropTypes.string,
  toggleNewPlaylistForm: PropTypes.func.isRequired,
  setNewPlaylistName: PropTypes.func.isRequired,
  isAddToPlaylistFormOpen: PropTypes.bool,
  toggleAddToPlaylistForm: PropTypes.func.isRequired,
  addToPlaylists: PropTypes.func.isRequired,
  // eslint-disable-next-line
  trackDropdownSelected: PropTypes.object,
  isEditTrackFormOpen: PropTypes.bool,
  toggleEditTrackForm: PropTypes.func.isRequired,
  submitTrackEdit: PropTypes.func.isRequired,
  toggleDeleteTrackForm: PropTypes.func.isRequired,
  isDeleteTrackFormOpen: PropTypes.bool,
  submitDeleteTrack: PropTypes.func.isRequired
};

Library.defaultProps = {
  query: "",
  newPlaylistName: "",
  isNewPlaylistFormOpen: false,
  isAddToPlaylistFormOpen: false,
  isEditTrackFormOpen: false,
  isDeleteTrackFormOpen: false,
  trackDropdownSelected: {
    title: "Title",
    artist: { name: "Artist" },
    genre: "Genre"
  }
};

const mapStateToProps = state => ({
  library: state.music.library,
  playlists: state.music.playlists,
  artists: state.music.artists,
  query: state.music.query,
  currentTrackID: state.musicPlayer.currentTrack.id,
  isPlaying: state.musicPlayer.isPlaying,
  isNewPlaylistFormOpen: state.music.isNewPlaylistFormOpen,
  isAddToPlaylistFormOpen: state.music.isAddToPlaylistFormOpen,
  newPlaylistName: state.music.newPlaylistName,
  trackDropdownSelected: state.music.trackDropdownSelected,
  isEditTrackFormOpen: state.music.isEditTrackFormOpen,
  isDeleteTrackFormOpen: state.music.isDeleteTrackFormOpen
});

const mapDispatchToProps = dispatch => ({
  importScLikes: user => dispatch(importScLikes(user)),
  setLibQuery: query =>
    dispatch({
      type: "SET_LIB_QUERY",
      payload: query
    }),
  resetQuery: () => dispatch({ type: "RESET_LIB_QUERY" }),
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
  toggleNewPlaylistForm: () => dispatch({ type: "TOGGLE_NEW_PLAYLIST_FORM" }),
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
  toggleAddToPlaylistForm: track =>
    dispatch({
      type: "TOGGLE_ADD_PLAYLIST_FORM",
      payload: track
    }),
  addToPlaylists: map =>
    dispatch({
      type: "ADD_TO_PLAYLISTS",
      payload: map
    }),
  toggleEditTrackForm: track =>
    dispatch({
      type: "TOGGLE_EDIT_TRACK_FORM",
      payload: track
    }),
  submitTrackEdit: newEdit =>
    dispatch({
      type: "EDIT_TRACK",
      payload: newEdit
    }),
  toggleDeleteTrackForm: track =>
    dispatch({
      type: "TOGGLE_DELETE_TRACK_FORM",
      payload: track
    }),
  submitDeleteTrack: () => dispatch({ type: "DELETE_TRACK" }),
  dispatch
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Library);
