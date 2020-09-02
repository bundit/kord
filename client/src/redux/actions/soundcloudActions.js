import { cacheValue, loadCachedValue } from "../../utils/sessionStorage";
import { fetchGeneric } from "../../utils/fetchGeneric";
import {
  importLikes,
  importPlaylistTracks,
  importPlaylists
} from "./libraryActions";
import {
  setArtistResults,
  setMoreTrackResults,
  setTrackResults
} from "./searchActions";
import { setConnection, setUserProfile } from "./userActions";

const KEY = process.env.REACT_APP_SC_KEY;

const LINK = 1;
const SC_API = "https://api.soundcloud.com";
const SC_API_V2 = "https://api-v2.soundcloud.com";

export const fetchSoundcloudProfile = userId => dispatch => {
  const endpoint = `${SC_API}/users/${userId}?client_id=${KEY}`;

  return fetchGeneric(endpoint)
    .then(json => {
      const profile = mapJsonToProfile(json);
      const beginHref = `${SC_API_V2}/users/${json.id}/likes?&limit=30&offset=0&linked_partitioning=${LINK}`;

      const userLikes = {
        id: "likes",
        title: "Soundcloud Likes",
        images: null,
        source: "soundcloud",
        tracks: [],
        total: json.public_favorites_count,
        next: beginHref,
        isConnected: true,
        dateSynced: new Date()
      };

      dispatch(importLikes("soundcloud", userLikes));
      dispatch(setUserProfile("soundcloud", profile));
    })
    .then(() => dispatch(setConnection("soundcloud", true)));
};

export const fetchSoundcloudLikes = (next, userId) => dispatch => {
  if (!next) {
    next = `${SC_API_V2}/users/${userId}/likes?&limit=30&offset=0&linked_partitioning=${LINK}`;
  }

  const proxyHref = `/api?url=${encodeURIComponent(`${next}`)}`;

  return fetchGeneric(proxyHref).then(json => {
    const tracks = mapCollectionToTracks(json.collection);
    const next = json.next_href;

    const likes = {
      tracks,
      next
    };

    dispatch(importLikes("soundcloud", likes));

    return likes;
  });
};

export const fetchSoundcloudPlaylists = username => dispatch => {
  const playlistEndpoint = `${SC_API}/users/${username}/playlists?client_id=${KEY}`;

  return fetchGeneric(playlistEndpoint).then(data => {
    const newPlaylists = mapCollectionToPlaylists(data);

    dispatch(importPlaylists("soundcloud", newPlaylists));
  });
};

export const fetchSoundcloudPlaylistTracks = (id, next) => dispatch => {
  const playlistEndpoint = `${SC_API}/playlists/${id}/?client_id=${KEY}`;

  return fetchGeneric(playlistEndpoint).then(data => {
    const tracks = mapCollectionToTracks(data.tracks);

    dispatch(importPlaylistTracks("soundcloud", id, tracks));

    return { tracks };
  });
};

export const searchSoundcloudTracks = (query, limit = 50) => dispatch => {
  const trackSearchEndpoint = `${SC_API}/tracks?q=${query}&limit=${limit}&format=json&client_id=${KEY}&linked_partitioning=1`;
  const storageKey = `SC:${query}:artists`;

  const cachedSearch = loadCachedValue(storageKey);
  if (cachedSearch) {
    dispatch(setTrackResults("soundcloud", cachedSearch));
    return Promise.resolve();
  }

  return fetchGeneric(trackSearchEndpoint).then(json => {
    const tracks = {
      list: mapCollectionToTracks(json.collection),
      next: json.next_href
    };

    dispatch(setTrackResults("soundcloud", tracks));
    cacheValue(storageKey, tracks);
  });
};

export const fetchMoreSoundcloudTrackResults = next => dispatch => {
  return fetchGeneric(next).then(json => {
    const tracks = mapCollectionToTracks(json.collection);
    const next = json.next_href;

    dispatch(setMoreTrackResults("soundcloud", { list: tracks, next }));
  });
};

export const searchSoundcloudArtists = (query, limit = 5) => dispatch => {
  const endpoint = `${SC_API}/users?q=${query}&client_id=${KEY}&limit=${limit}`;

  return fetchScArtists(endpoint).then(artistList =>
    dispatch(setArtistResults("soundcloud", artistList))
  );
};

function fetchScArtists(endpoint) {
  return fetchGeneric(endpoint).then(json => mapJsonToArtists(json));
}

export function mapCollectionToTracks(collection) {
  if (!collection) {
    throw new Error("Collection is invalid");
  }

  return collection
    .map(track => track.track || track.playlist || track)
    .map(track => ({
      title: track.title,
      id: track.id,
      duration: track.duration,
      streamable: track.streamable,
      img: track.artwork_url,
      source: "soundcloud",
      artist: {
        name: track.user.username,
        img: track.user.avatar_url,
        id: track.user.id
      },
      permalink: `${track.user.permalink}/${track.permalink}`
      // date: track.created_at,
      // likes: track.likes_count,
      // genre: track.genre,
      // uri: track.uri,
      // wave: track.waveform_url,
      // streamUrl: track.stream_url,
    }));
}

function mapCollectionToPlaylists(collection) {
  if (!collection) {
    throw new Error("Invalid soundcloud collection object");
  }

  return collection.map(item => ({
    id: item.id,
    title: item.title,
    img: item.artwork_url,
    externalUrl: item.permalink_url,
    source: "soundcloud",
    tracks: mapCollectionToTracks(item.tracks),
    total: item.tracks.length,
    isConnected: true,
    dateSynced: null
  }));
}

function mapJsonToProfile(json) {
  return {
    fullName: json.full_name,
    username: json.permalink,
    displayName: json.username,
    id: json.id,
    image: json.avatar_url,
    profileUrl: json.permalink_url
  };
}

function mapJsonToArtists(json) {
  return json.map(artist => ({
    name: artist.username,
    id: artist.id,
    numFollowers: artist.followers_count,
    img: artist.avatar_url
  }));
}
