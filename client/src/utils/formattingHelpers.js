export function formatArtistName(artist) {
  if (!artist) {
    return "";
  }

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

export function msToDuration(duration) {
  const base = 10;

  let seconds = parseInt((duration / 1000) % 60, base);
  const minutes = parseInt((duration / (1000 * 60)) % 60, base);
  const hours = parseInt((duration / (1000 * 60 * 60)) % 24, base);

  seconds = seconds < 10 ? `0${seconds}` : seconds;

  if (hours >= 1) {
    return `${hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds}`;
  }
  return `${minutes}:${seconds}`;
}

export function secondsToFormatted(total) {
  const base = 10;
  const hours = parseInt((total / (60 * 60)) % 24, base);
  const minutes = parseInt((total / 60) % 60, base);
  const seconds = parseInt(total % 60, base);

  if (hours >= 1) {
    return `${hours}:${minutes < 10 ? `0${minutes}` : minutes}:${
      seconds < 10 ? `0${seconds}` : seconds
    }`;
  }

  return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
}

export function capitalizeWord(word) {
  if (!word || !word.length) {
    return "";
  }
  return word.charAt(0).toUpperCase() + word.slice(1);
}
