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

export function generateProfilePayload(source, profile) {
  return {
    source,
    profile: {
      id: profile.id,
      img: profile.image,
      username: profile.username,
      profile_url: profile.profileUrl
    }
  };
}

export function generatePlaylistsPayload(source, playlists) {
  return {
    source,
    playlists: playlists.map((playlist, index) => {
      const { id, isConnected, title, img, total, isStarred } = playlist;

      return {
        id,
        isConnected,
        title,
        index,
        img,
        total,
        isStarred
      };
    })
  };
}

export function formatNumber(x) {
  //https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function keepWithinVolumeRange(volume) {
  if (volume < 0) {
    return 0;
  }

  if (volume > 1) {
    return 1;
  }

  return volume;
}

export function filterUnconnected(playlists) {
  return playlists.filter(playlist => playlist.isConnected);
}

export function getTitleFromPathname(pathname) {
  // Get only last route
  let title = pathname.slice(pathname.lastIndexOf("/") + 1);

  return capitalizeWord(title);
}
