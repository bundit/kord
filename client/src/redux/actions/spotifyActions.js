import SpotifyWebApi from "spotify-web-api-js";

import { fetchGeneric } from "./soundcloudActions";
import {
  importLikes,
  importPlaylistTracks,
  importPlaylists,
  setNextPlaylistHref
} from "./libraryActions";
import { setAccessToken, setConnection, setUserProfile } from "./userActions";
import { setArtistResults, setTrackResults } from "./searchActions";

const SPOTIFY = "spotify";
const spotifyApi = new SpotifyWebApi();

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

export const setSpotifyProfile = () => dispatch => {
  return spotifyApi
    .getMe({})
    .then(json => {
      const profile = mapJsonToProfile(json);

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
  offset = 0,
  market = "from_token"
) => dispatch => {
  return spotifyApi.getMySavedTracks({ limit, offset, market }).then(json => {
    const newTracks = mapJsonToTracks(json);

    const userLikes = {
      title: "Spotify Likes",
      id: "likes",
      tracks: newTracks,
      next: json.next,
      total: json.total,
      source: "spotify",
      isConnected: false
    };

    dispatch(importLikes("spotify", userLikes));
  });
};

export const getUserSpotifyPlaylists = (limit = 50, offset = 0) => dispatch => {
  return spotifyApi
    .getUserPlaylists({ limit, offset })
    .then(json => {
      const playlists = mapJsonToPlaylists(json);

      dispatch(importPlaylists(SPOTIFY, playlists));
    })
    .catch(e => {
      return dispatch(errorHandler(e)).then(() =>
        dispatch(getUserSpotifyPlaylists(limit, offset))
      );
    });
};

export const getSpotifyPlaylistTracks = (
  id,
  next,
  market = "from_token"
) => dispatch => {
  let json;

  if (next === "start") {
    json = spotifyApi.getPlaylistTracks(id, { market });
  } else {
    json = spotifyApi.getGeneric(next);
  }

  return json
    .then(json => {
      const newTracks = mapJsonToTracks(json);

      dispatch(importPlaylistTracks(SPOTIFY, id, newTracks));
      dispatch(setNextPlaylistHref(SPOTIFY, id, json.next));
    })
    .catch(err => {
      return dispatch(errorHandler(err)).then(() =>
        dispatch(getSpotifyPlaylistTracks(id, next))
      );
    });
};

export const searchSpotify = (
  query,
  types = ["track", "artist", "album"],
  market = "from_token"
) => dispatch => {
  spotifyApi
    .search(query, types, { market })
    .then(({ tracks, artists, album }) => {
      const trackList = mapJsonToTracks(tracks, true);
      const nextTrackHref = tracks.next;
      dispatch(
        setTrackResults("spotify", { list: trackList, next: nextTrackHref })
      );

      const artistList = mapJsonToArtists(artists);
      dispatch(setArtistResults("spotify", artistList));
    });

  //TODO do something with albums maybe
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

function mapJsonToTracks(json, search = false) {
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
    images: item.images,
    source: "spotify",
    tracks: [],
    total: item.tracks.total,
    next: "start",
    isConnected: false
  }));
}
