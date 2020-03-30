import { formatArtistName } from "./formatArtistName";

/**
 * compareSongs - Compares two songs in alphabetic order
 * Compares by title > artist > source
 *
 * @param  {object} song1
 * @param  {object} song2
 * @return {number}
 * Returns > 0 if song1 comes first, < 0 if song2 comes first and 0 if they are the same
 */
export default function compareSongs(song1, song2) {
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
