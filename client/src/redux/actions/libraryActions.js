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

export function removeLibraryTracks(source) {
  return {
    type: "REMOVE_LIBRARY_TRACKS",
    payload: source
  };
}
