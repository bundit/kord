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
  const artistCompare = artist1.name
    .toLowerCase()
    .localeCompare(artist2.name.toLowerCase());

  return artistCompare;
}
