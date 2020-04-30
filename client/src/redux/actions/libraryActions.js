import { getUserSoundcloudPlaylists } from "./soundcloudActions";
import { getUserSpotifyPlaylists } from "./spotifyActions";

export function importSongs(songs) {
  return {
    type: "IMPORT_SONGS",
    payload: songs
  };
}

export function importSong(song) {
  return {
    type: "IMPORT_SONG",
    payload: song
  };
}

export function importLikes(source, likes) {
  return {
    type: "IMPORT_LIKES",
    source,
    payload: likes
  };
}

export function importPlaylists(source, playlists) {
  return {
    type: "IMPORT_PLAYLISTS",
    source,
    payload: playlists
  };
}

export function importPlaylistTracks(source, playlistId, tracks) {
  return {
    type: "IMPORT_PLAYLIST_TRACKS",
    source,
    playlistId,
    payload: tracks
  };
}

export function setNextPlaylistHref(source, playlistId, nextHref) {
  return {
    type: "SET_NEXT_PLAYLIST_HREF",
    source,
    playlistId,
    payload: nextHref
  };
}

export function movePlaylistsToTrash(source) {
  return {
    type: "MOVE_PLAYLISTS_TO_TRASH",
    payload: source
  };
}

export function restorePlaylistsFromTrash(source) {
  return {
    type: "RESTORE_PLAYLISTS_FROM_TRASH",
    payload: source
  };
}

export function clearTrash(source) {
  return {
    type: "CLEAR_TRASH",
    payload: source
  };
}

export const setPlaylistConnections = (source, newSettings) => {
  return {
    type: "SET_PLAYLIST_CONNECTIONS",
    source,
    payload: newSettings
  };
};

export const fetchPlaylists = (source, username) => dispatch => {
  if (source === "spotify") {
    return dispatch(getUserSpotifyPlaylists());
  } else if (source === "soundcloud") {
    return dispatch(getUserSoundcloudPlaylists(username));
  }
};
