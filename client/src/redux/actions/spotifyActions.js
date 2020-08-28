import SpotifyWebApi from "spotify-web-api-js";

import { cacheValue, loadCachedValue } from "../../utils/sessionStorage";
import { fetchGeneric } from "../../utils/fetchGeneric";
import {
  importLikes,
  importPlaylistTracks,
  importPlaylists,
  setNextPlaylistHref
} from "./libraryActions";
import { setAccessToken, setConnection, setUserProfile } from "./userActions";
import {
  setArtistResults,
  setMoreTrackResults,
  setTrackResults
} from "./searchActions";

const SPOTIFY = "spotify";
export const spotifyApi = new SpotifyWebApi();

export const setSpotifyAccessToken = token => dispatch => {
  spotifyApi.setAccessToken(token);

  dispatch(setAccessToken("spotify", token));
  dispatch(setConnection("spotify", true));
};

export const refreshSpotifyToken = () => dispatch => {
  return fetchGeneric(`/auth/spotify/refresh`).then(json => {
    dispatch(setSpotifyAccessToken(json.accessToken));
    return json.accessToken;
  });
};

export const fetchSpotifyProfile = (tries = 3) => dispatch => {
  return spotifyApi
    .getMe({})
    .then(json => {
      const profile = mapJsonToProfile(json);

      dispatch(setUserProfile("spotify", profile));
    })
    .then(() => dispatch(fetchSpotifyLikes()))
    .catch(e => {
      if (tries) {
        return dispatch(errorHandler(e)).then(() =>
          dispatch(fetchSpotifyProfile(--tries))
        );
      } else return Promise.reject(e);
    });
};

export const fetchSpotifyLikes = (
  limit = 50,
  offset = 0,
  market = "from_token",
  tries = 3
) => dispatch => {
  return spotifyApi
    .getMySavedTracks({ limit, offset, market })
    .then(json => {
      const tracks = mapJsonToTracks(json);
      const next = json.next;

      const userLikes = {
        title: "Spotify Likes",
        id: "likes",
        tracks: tracks,
        next: next,
        total: json.total,
        source: "spotify",
        isConnected: true,
        dateSynced: new Date()
      };

      dispatch(importLikes("spotify", userLikes));

      return { tracks, next };
    })
    .catch(e => {
      if (tries) {
        return dispatch(errorHandler(e)).then(() =>
          dispatch(fetchSpotifyLikes(limit, offset, market, --tries))
        );
      } else return Promise.reject(e);
    });
};

export const fetchSpotifyPlaylists = (
  limit = 50,
  offset = 0,
  tries = 3
) => dispatch => {
  return spotifyApi
    .getUserPlaylists({ limit, offset })
    .then(json => {
      const playlists = mapJsonToPlaylists(json);

      dispatch(importPlaylists(SPOTIFY, playlists));
    })
    .catch(e => {
      if (tries) {
        return dispatch(errorHandler(e)).then(() =>
          dispatch(fetchSpotifyPlaylists(limit, offset, --tries))
        );
      } else return Promise.reject(e);
    });
};

export const fetchSpotifyPlaylistTracks = (
  id,
  next,
  market = "from_token",
  tries = 3
) => dispatch => {
  let json;

  if (next === "start") {
    json = spotifyApi.getPlaylistTracks(id, { market });
  } else {
    json = spotifyApi.getGeneric(next);
  }

  return json
    .then(json => {
      const tracks = mapJsonToTracks(json);
      const next = json.next;

      dispatch(importPlaylistTracks(SPOTIFY, id, tracks));
      dispatch(setNextPlaylistHref(SPOTIFY, id, next));

      return { tracks, next };
    })
    .catch(e => {
      if (tries) {
        return dispatch(errorHandler(e)).then(() =>
          dispatch(fetchSpotifyPlaylistTracks(id, next, market, --tries))
        );
      } else return Promise.reject(e);
    });
};

export const searchSpotify = (
  query,
  limit = 20,
  offset = 0,
  types = ["track", "artist", "album"],
  market = "from_token",
  tries = 3
) => dispatch => {
  const storageKey = `SPOT:${query}`;

  const cachedSearch = loadCachedValue(storageKey);
  if (cachedSearch) {
    const payload = parseSpotifyResults(cachedSearch);
    dispatch(setSpotifyResults(payload));
    return Promise.resolve();
  }

  return spotifyApi
    .search(query, types, { market })
    .then(json => {
      const payload = parseSpotifyResults(json);

      dispatch(setSpotifyResults(payload));
      cacheValue(storageKey, json);
    })
    .catch(e => {
      if (tries) {
        return dispatch(errorHandler(e)).then(() =>
          dispatch(searchSpotify(query, limit, offset, types, market, --tries))
        );
      } else return Promise.reject(e);
    });
};

export const fetchMoreSpotifyTrackResults = (next, tries = 3) => dispatch => {
  if (!next) return Promise.reject("No more results");

  return spotifyApi
    .getGeneric(next)
    .then(json => {
      const { tracksPayload } = parseSpotifyResults(json);

      dispatch(setMoreTrackResults("spotify", tracksPayload));
    })
    .catch(e => {
      if (tries) {
        return dispatch(errorHandler(e)).then(() =>
          dispatch(fetchMoreSpotifyTrackResults(next, --tries))
        );
      } else return Promise.reject(e);
    });
};

function parseSpotifyResults(json) {
  // eslint-disable-next-line
  const { tracks, artists, album } = json;

  let tracksPayload, artistsPayload;

  if (tracks) {
    tracksPayload = {
      list: mapJsonToTracks(tracks, true),
      next: tracks.next,
      total: tracks.total
    };
  }

  if (artists) {
    artistsPayload = mapJsonToArtists(artists);
  }

  return { tracksPayload, artistsPayload };
}

const setSpotifyResults = payload => dispatch => {
  const { tracksPayload, artistsPayload } = payload;

  if (!tracksPayload && !artistsPayload) {
    return Promise.reject({ message: "No search results" });
  }

  if (tracksPayload) {
    dispatch(setTrackResults("spotify", tracksPayload));
  }

  if (artistsPayload) {
    dispatch(setArtistResults("spotify", artistsPayload));
  }

  return Promise.resolve({ message: "Results set" });
};

export const addToSpotifyPlaylist = (
  playlistId,
  track,
  tries = 3
) => dispatch => {
  let request;
  const trackUri = `spotify:track:${track.id}`;

  if (playlistId === "likes") {
    request = spotifyApi.addToMySavedTracks([track.id]);
  } else {
    request = spotifyApi.addTracksToPlaylist(playlistId, [trackUri]);
  }

  return request.catch(e => {
    if (tries) {
      return dispatch(errorHandler(e)).then(() =>
        dispatch(addToSpotifyPlaylist(playlistId, track.id, --tries))
      );
    } else return Promise.reject(e);
  });
};

export const removeFromSpotifyPlaylist = (track, tries = 3) => dispatch => {
  let request;
  const trackUri = `spotify:track:${track.id}`;

  if (track.playlistId === "likes") {
    request = spotifyApi.removeFromMySavedTracks([track.id]);
  } else {
    request = spotifyApi.removeTracksFromPlaylist(track.playlistId, [
      { uri: trackUri, positions: [track.index] }
    ]);
  }

  return request.catch(e => {
    if (tries) {
      return dispatch(errorHandler(e)).then(() =>
        dispatch(removeFromSpotifyPlaylist(track.playlistId, track.id, --tries))
      );
    } else return Promise.reject(e);
  });
};

function errorHandler(err, tries = 3) {
  return dispatch => {
    if (!tries) {
      return Promise.reject(err);
    }

    if (err.status === 401) {
      return dispatch(refreshSpotifyToken());
    }

    return dispatch(errorHandler(err, --tries));
  };
}

function mapJsonToProfile(json) {
  return {
    username: json.display_name,
    image: json.images[0].url,
    profileUrl: json.external_urls.spotify
  };
}

export function mapJsonToTracks(json, search = false) {
  if (!search) {
    json = json.items.map(trackData => trackData.track);
  } else json = json.items;

  return json.map(track => ({
    album: {
      title: track.album.name,
      id: track.album.id
    },
    id: track.id,
    duration: track.duration_ms,
    title: track.name,
    artist: track.artists.map(artist => ({
      id: artist.id,
      name: artist.name
    })),
    img: track.album.images,
    streamable: track.is_playable,
    source: "spotify"
  }));
}

function mapJsonToArtists(json) {
  return json.items.map(artist => ({
    name: artist.name,
    id: artist.id,
    numFollowers: artist.followers.total,
    img: artist.images
  }));
}

function mapJsonToPlaylists(json) {
  return json.items.map(item => ({
    id: item.id,
    title: item.name,
    img: item.images,
    source: "spotify",
    tracks: [],
    total: item.tracks.total,
    next: "start",
    isConnected: true,
    dateSynced: null
  }));
}
