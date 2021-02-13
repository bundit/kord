import placeholderImg from "../assets/track-placeholder.png";

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

export function formatSourceName(source) {
  return source === "youtube" ? "YouTube" : capitalizeWord(source);
}

export function YTDurationToMilliseconds(duration) {
  // https://stackoverflow.com/questions/22148885/converting-youtube-data-api-v3-video-duration-format-to-seconds-in-javascript-no
  var match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

  if (duration === "P0D") {
    return "Live";
  }

  match = match.slice(1).map(function(x) {
    if (x != null) {
      return x.replace(/\D/, "");
    }
    return x;
  });

  var hours = parseInt(match[0]) || 0;
  var minutes = parseInt(match[1]) || 0;
  var seconds = parseInt(match[2]) || 0;

  return hours * 3600000 + minutes * 60000 + seconds * 1000;
}

// Take the global playlist object like
// {soundcloud: [], spotify: [], ...}
// and return a flat array of the playlist objects
export function flattenPlaylistObject(playlists) {
  let flatPlaylistObject = [];

  const playlistSources = Object.keys(playlists);

  for (let key of playlistSources) {
    flatPlaylistObject.push(...playlists[key]);
  }

  return flatPlaylistObject;
}

export function reorder(list, sourceIndex, destinationIndex) {
  const result = Array.from(list);
  const [removed] = result.splice(sourceIndex, 1);
  result.splice(destinationIndex, 0, removed);

  return result;
}

// https://stackoverflow.com/questions/3177836/how-to-format-time-since-xxx-e-g-4-minutes-ago-similar-to-stack-exchange-site
export function timeSince(date) {
  date = Date.parse(date);

  const seconds = Math.floor((new Date() - date) / 1000);
  let interval = Math.floor(seconds / 31536000);

  if (interval > 1) {
    return interval + " years lol";
  }

  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return interval + " months";
  }

  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return interval + " days";
  }

  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return interval + " hours";
  }

  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return interval + " minutes";
  }

  if (seconds > 1) {
    return Math.floor(seconds) + " seconds";
  }

  return "just now";
}

export function getImgUrl(track, size) {
  if (!track || !track.img) {
    return placeholderImg;
  }

  try {
    if (track.source === "soundcloud") {
      if (size === "sm") {
        return track.img.replace("large", "t67x67");
      }
      if (size === "md") {
        return track.img.replace("large", "t300x300");
      }
      if (size === "lg") {
        return track.img.replace("large", "original");
      }
    } else if (track.source === "spotify") {
      if (!track.img.length) {
        return placeholderImg;
      }

      if (size === "sm") {
        return track.img[2].url;
      }
      if (size === "md") {
        return track.img[1].url;
      }
      if (size === "lg") {
        return track.img[0].url;
      }
    } else if (track.source === "youtube") {
      if (size === "sm") {
        return track.img.default.url || track.img.medium.url;
      }
      if (size === "md") {
        return track.img.medium.url || track.img.high.url;
      }
      if (size === "lg") {
        return (
          (track.img.standard && track.img.standard.url) || track.img.high.url
        );
      }
    }
  } catch (e) {
    return placeholderImg;
  }
}
