import SpotifyWebApi from "spotify-web-api-js";

import {
  importLikes,
  importPlaylistTracks,
  importPlaylists,
  setNextPlaylistHref
} from "./libraryActions";
import { setAccessToken, setConnection, setUserProfile } from "./userActions";

const SPOTIFY = "spotify";
const spotifyApi = new SpotifyWebApi();

export const setSpotifyAccessToken = token => dispatch => {
  spotifyApi.setAccessToken(token);

  dispatch(setAccessToken("spotify", token));
  dispatch(setConnection("spotify", true));
};

export const refreshSpotifyToken = () => dispatch => {
  return fetch(`/auth/spotify/refresh`)
    .then(res => {
      if (res.status < 200 || res.status >= 300) {
        return Promise.reject(res);
      }

      return res.json();
    })
    .then(obj => {
      dispatch(setSpotifyAccessToken(obj.accessToken));
      return obj.accessToken;
    });
};

export const setSpotifyProfile = () => dispatch => {
  return spotifyApi
    .getMe({})
    .then(data => {
      const profile = {
        username: data.display_name,
        image: data.images[0].url,
        profileUrl: data.external_urls.spotify
      };

      dispatch(setUserProfile("spotify", profile));
    })
    .then(() => dispatch(importSavedSpotifyTracks()))
    .catch(e => {
      return dispatch(errorHandler(e)).then(() =>
        dispatch(setSpotifyProfile())
      );
    });
};

export const importSavedSpotifyTracks = (
  limit = 50,
  offset = 0
) => dispatch => {
  return spotifyApi.getMySavedTracks({ limit, offset }).then(data => {
    const newTracks = mapSpotifyResponseToTrackObjects(data);

    const userLikes = {
      title: "Spotify Likes",
      id: "likes",
      tracks: newTracks,
      next: data.next,
      total: data.total,
      source: "spotify",
      isConnected: false
    };

    dispatch(importLikes("spotify", userLikes));
  });
};

export const getUserSpotifyPlaylists = (limit = 50, offset = 0) => dispatch => {
  return spotifyApi
    .getUserPlaylists({ limit, offset })
    .then(data => {
      const playlists = mapSpotifyResponseToPlaylists(data);

      dispatch(importPlaylists(SPOTIFY, playlists));
    })
    .catch(e => {
      return dispatch(errorHandler(e)).then(() =>
        dispatch(getUserSpotifyPlaylists(limit, offset))
      );
    });
};

export const getSpotifyPlaylistTracks = (id, next) => dispatch => {
  let data;

  if (next === "start") {
    data = spotifyApi.getPlaylistTracks(id);
  } else {
    data = spotifyApi.getGeneric(next);
  }

  return data
    .then(data => {
      const newTracks = mapSpotifyResponseToTrackObjects(data);

      dispatch(importPlaylistTracks(SPOTIFY, id, newTracks));
      dispatch(setNextPlaylistHref(SPOTIFY, id, data.next));
    })
    .catch(err => {
      return dispatch(errorHandler(err)).then(() =>
        dispatch(getSpotifyPlaylistTracks(id, next))
      );
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

function mapSpotifyResponseToTrackObjects(data) {
  return data.items
    .map(trackData => trackData.track)
    .map(track => ({
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
      source: "spotify"
    }));
}

function mapSpotifyResponseToPlaylists(data) {
  return data.items.map(item => ({
    id: item.id,
    title: item.name,
    images: item.images,
    source: "spotify",
    tracks: [],
    total: item.tracks.total,
    next: "start",
    isConnected: false
  }));
}
