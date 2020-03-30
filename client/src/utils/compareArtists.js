import { formatArtistName } from "./formatArtistName";

/**
 * compareArtists - Compares two artists in alphabetic order
 * Compares by artist name
 *
 * @param  {object} artist1
 * @param  {object} artist2
 * @return {number}
 * Returns > 0 if artist1 comes first, < 0 if artist2 comes first and 0 if they are the same
 */

export default function compareArtists(artist1, artist2) {
  artist1 = formatArtistName(artist1);
  artist2 = formatArtistName(artist2);

  return artist1.toLowerCase().localeCompare(artist2.toLowerCase());
}
