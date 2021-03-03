import { formatArtistName, getImgUrl } from "./formattingHelpers";

export function compareSongs(song1, song2) {
  const titleCompare = song1.title
    .toLowerCase()
    .localeCompare(song2.title.toLowerCase());

  if (titleCompare !== 0) {
    return titleCompare;
  }

  const artist1 = formatArtistName(song1.artist);
  const artist2 = formatArtistName(song2.artist);
  const artistCompare = artist1
    .toLowerCase()
    .localeCompare(artist2.toLowerCase());

  if (artistCompare !== 0) {
    return artistCompare;
  }

  const sourceCompare = song1.source.localeCompare(song1.source);

  return sourceCompare;
}

export function compareArtists(artist1, artist2) {
  artist1 = formatArtistName(artist1);
  artist2 = formatArtistName(artist2);

  return artist1.toLowerCase().localeCompare(artist2.toLowerCase());
}

export function compareGenres(genre1, genre2) {
  return genre1.toLowerCase().localeCompare(genre2.toLowerCase());
}

export function hasProfileChanges(newProfile, prevProfile) {
  if (!newProfile || !newProfile.id) {
    return false;
  }

  const keys = ["isConnected", "id", "image", "username", "profileUrl"];

  return keys.some(key => newProfile[key] !== prevProfile[key]);
}

export function hasNewPlaylistOrHasChanges(
  newListOfPlaylists,
  prevListOfPlaylists
) {
  if (!newListOfPlaylists || !prevListOfPlaylists || !newListOfPlaylists.length)
    return false;

  if (prevListOfPlaylists.length !== newListOfPlaylists.length) {
    return true;
  }

  for (let i = 0; i < newListOfPlaylists.length; i++) {
    const newPlaylist = newListOfPlaylists[i];
    const prevPlaylist = prevListOfPlaylists[i];

    if (hasPlaylistChanges(newPlaylist, prevPlaylist)) {
      return true;
    }
  }

  return false;
}

function hasPlaylistChanges(newPlaylist, prevPlaylist) {
  const keys = ["id", "title", "isConnected", "total", "isStarred"];

  return (
    keys.some(key => newPlaylist[key] !== prevPlaylist[key]) ||
    getImgUrl(prevPlaylist, "lg") !== getImgUrl(newPlaylist, "lg")
  );
}

export function isEmptyObject(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}
