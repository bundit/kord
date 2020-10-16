import { Route } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import React from "react";

import LibraryList from "./library-list";
import PlaylistPage from "./playlist-page";

const LibraryPage = () => {
  return (
    <>
      <Route exact path="/app/library" component={LibraryList} />
      <Route
        exact
        path="/app/library/playlists/:source/:id/:title"
        render={({
          match: {
            params: { source, id, title }
          }
        }) => <PlaylistPage key={`playlists/${source}:${id}:${title}`} />}
      />
    </>
  );
};

LibraryPage.propTypes = {
  isPlaying: PropTypes.bool.isRequired,
  currentTrackID: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  playlists: PropTypes.object.isRequired
};

LibraryPage.defaultProps = {
  playlists: []
};

const mapStateToProps = state => ({
  playlists: state.library.playlists,
  currentTrackID: state.player.currentTrack.id,
  isPlaying: state.player.isPlaying
});

export default connect(mapStateToProps)(LibraryPage);
