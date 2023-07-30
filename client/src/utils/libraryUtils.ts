export function getTrackExternalLink(track: any): string {
  switch (track.source) {
    case "spotify": {
      return `https://open.spotify.com/track/${track.id}`;
    }

    case "soundcloud": {
      return `https://soundcloud.com/${track.permalink}`;
    }

    case "youtube": {
      return `https://www.youtube.com/watch?v=${track.id}`;
    }

    default: {
      return "";
    }
  }
}
