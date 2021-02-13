import PropTypes from "prop-types";
import React from "react";

import {
  filterUnconnected,
  flattenPlaylistObject
} from "../utils/formattingHelpers";
import PlaylistItem from "./playlist-item";

const ListOfPlaylists = ({
  playlists,
  sidebar,
  isListOfStarredPlaylists,
  source
}) => {
  if (!Array.isArray(playlists)) {
    playlists = flattenPlaylistObject(playlists);
  }

  return filterUnconnected(playlists).map(playlist => (
    <PlaylistItem
      key={`${playlist.source} ${playlist.title} ${playlist.id}`}
      playlist={playlist}
      sidebar={sidebar}
      isStarredPlaylist={isListOfStarredPlaylists}
    />
  ));
};

ListOfPlaylists.propTypes = {
  playlists: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
};

export default ListOfPlaylists;
