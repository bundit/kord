import { formatArtistName } from "./formattingHelpers";

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
