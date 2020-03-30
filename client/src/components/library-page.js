import { Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import React from "react";

import { formatArtistName } from "../utils/formatArtistName";
import { importScLikes } from "../redux/actions/libraryActions";
import AddToPlaylistForm from "./add-to-playlist-form";
import ArtistList from "./artist-list";
import CategoryList from "./category-list";
import DeleteTrackForm from "./delete-track-form";
import EditTrackForm from "./edit-track-form";
import ListOfPlaylists from "./playlist-list";
import NewPlaylistForm from "./new-playlist-form";
import TrackList from "./track-list";

class Library extends React.Component {
  constructor(props) {
    super(props);

    this.handlePlayTrack = this.handlePlayTrack.bind(this);
    this.handleNewPlaylist = this.handleNewPlaylist.bind(this);
    this.handleSubmitAddToPlaylists = this.handleSubmitAddToPlaylists.bind(
      this
    );
    this.onResize = this.onResize.bind(this);

    this.state = { isMobile: window.innerWidth < 800 };
  }

  componentDidMount() {
    window.addEventListener("resize", this.onScroll);
    // this.props.importScLikes("bundit");
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.onScroll);
  }

  onResize() {
    this.setState({ isMobile: window.innerWidth < 800 });
  }

  handlePlayTrack(track) {
    const { songs, playTrack, setQueue } = this.props;
    let index = 0;

    // Find index of song clicked
    while (songs[index].id !== track.id && index < songs.length) {
      index += 1;
    }

    playTrack(track);

    // Set the queue to the remaining songs
    setQueue(songs.slice(index));
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
    let { songs } = this.props;
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
      handlePlayTrack,
      handleNewPlaylist,
      handleSubmitAddToPlaylists
    } = this;

    // TODO: create new filtering for songs and artist view
    // if (query && query.length >= 3) {
    //   const filteredSongs = songs.filter(
    //     ({ title, artist }) =>
    //       title.toLowerCase().includes(query) ||
    //       artist.name.toLowerCase().includes(query)
    //   );
    // }

    return (
      <>
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
          exact={this.state.isMobile}
          path="/app/library"
          render={() => <CategoryList categories={categories} mobile />}
        />
        <Route
          render={({ location }) => {
            const { pathname } = location;
            return (
              // <TransitionGroup>
              //   <CSSTransition
              //     key={pathname}
              //     classNames={fadeTransition}
              //     timeout={{
              //       enter: 300,
              //       exit: 0
              //     }}
              //   >
                <Route
                  location={location}
                  render={() => (
                    <Switch>
                      <Route
                        exact
                        path="/app/library/songs"
                        render={() => (
                          <TrackList
                            songs={songs}
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
                        path="/app/library/artists"
                        render={() => <ArtistList artists={artists} />}
                      />
                      <Route
                        path="/app/library/artists/:artist"
                        render={props => (
                          <TrackList
                            songs={songs.filter(
                              song =>
                              formatArtistName(song.artist) ===
                              props.match.params.artist
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
                      path="/app/library/playlists"
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
              //   </CSSTransition>
              // </TransitionGroup>
            );
          }}
        />
      </>
    );
  }
}

Library.propTypes = {
  songs: PropTypes.arrayOf(PropTypes.object).isRequired,
  artist: PropTypes.oneOfType([
    PropTypes.shape({ name: PropTypes.string.isRequired }),
    PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string.isRequired }))
  ]),
  playTrack: PropTypes.func.isRequired,
  setQueue: PropTypes.func.isRequired,
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
  songs: [],
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
  },
  playlists: [],
  artists: []
};

const mapStateToProps = state => ({
  songs: state.library.songs,
  playlists: state.library.playlists,
  artists: state.library.artists,
  currentTrackID: state.player.currentTrack.id,
  isPlaying: state.player.isPlaying,
  isNewPlaylistFormOpen: state.form.isNewPlaylistFormOpen,
  isAddToPlaylistFormOpen: state.form.isAddToPlaylistFormOpen,
  newPlaylistName: state.form.newPlaylistName,
  trackDropdownSelected: state.form.trackDropdownSelected,
  isEditTrackFormOpen: state.form.isEditTrackFormOpen,
  isDeleteTrackFormOpen: state.form.isDeleteTrackFormOpen
});

const mapDispatchToProps = dispatch => ({
  importScLikes: user => dispatch(importScLikes(user)),
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
