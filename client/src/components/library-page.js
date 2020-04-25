import { Route, Switch } from "react-router-dom";
import { connect, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import React from "react";

import {
  setQueue,
  setQueueIndex,
  setTrack
} from "../redux/actions/playerActions";
import { useMobileDetection } from "../utils/hooks";
import CategoryList from "./category-list";
import ListOfPlaylists from "./playlist-list";
import PlaylistTracklist from "./playlist-track-list";

const Library = ({ songs, artists, playlists, currentTrackID, isPlaying }) => {
  const isMobile = useMobileDetection();
  const dispatch = useDispatch();

  function handlePlayTrack(track, tracklist) {
    // Casting is needed sometimes
    // eslint-disable-next-line
    const index = tracklist.findIndex(song => song.id == track.id);

    dispatch(setTrack(track));
    dispatch(setQueueIndex(index));
    dispatch(setQueue(tracklist));
  }

  const categories = ["Playlists", "Artists", "Songs", "Albums", "Genres"];
  return (
    <>
      <Route
        exact={isMobile}
        path="/app/library"
        render={() => <CategoryList categories={categories} mobile />}
      />
      <Route
        render={({ location }) => {
          return (
            <Route
              location={location}
              render={() => (
                <Switch>
                  <Route
                    exact
                    path="/app/library/playlists"
                    render={() => <ListOfPlaylists playlists={playlists} />}
                  />
                  <Route
                    exact
                    path="/app/library/playlists/:source/:id/:title"
                    render={props => (
                      <PlaylistTracklist
                        {...props.match.params}
                        playlists={playlists}
                        isPlaying={isPlaying}
                        handlePlay={handlePlayTrack}
                        currentTrackID={currentTrackID}
                      />
                    )}
                  />
                </Switch>
              )}
            />
          );
        }}
      />
    </>
  );
};

Library.propTypes = {
  songs: PropTypes.arrayOf(PropTypes.object).isRequired,
  artist: PropTypes.oneOfType([
    PropTypes.shape({ name: PropTypes.string.isRequired }),
    PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string.isRequired }))
  ]),
  isPlaying: PropTypes.bool.isRequired,
  currentTrackID: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  playlists: PropTypes.object.isRequired
};

Library.defaultProps = {
  songs: [],
  query: "",
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
  isPlaying: state.player.isPlaying
});

export default connect(mapStateToProps)(Library);
