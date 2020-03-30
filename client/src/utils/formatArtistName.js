export function formatArtistName(artist) {
  if (artist.name) {
    return artist.name;
  }

  let artistName = "";

  for (let i = 0; i < artist.length; i++) {
    artistName += artist[i].name;

    if (i !== artist.length - 1) {
      artistName += ", ";
    }
  }

  return artistName;
}
