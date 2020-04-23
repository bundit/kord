import { ADD_TO_SEARCH_HISTORY, IMPORT_SONG } from "./types";
import { importPlaylists, importSongs } from "./libraryActions";
import { setConnection, setUserProfile } from "./userActions";

const KEY = process.env.REACT_APP_SC_KEY || process.env.SOUNDCLOUD_CLIENT_ID;

const MAX_LIMIT = 200;
const LINK = 1;
const SC_API_BASE_URL = "https://api.soundcloud.com";

export const getSoundcloudProfile = userId => async dispatch => {
  const endpoint = `${SC_API_BASE_URL}/users/${userId}?client_id=${KEY}`;

  return fetch(endpoint)
    .then(res => {
      if (res.status < 200 || res.status >= 300) {
        return Promise.reject(res);
      }
      return res.json();
    })
    .then(json => {
      const profile = mapJsonToProfileObject(json);

      dispatch(setUserProfile("soundcloud", profile));
      dispatch(setConnection("soundcloud", true));
    });
};

export const importScLikes = username => async dispatch => {
  let nextEndpoint = `${SC_API_BASE_URL}/users/${username}/favorites?client_id=${KEY}&limit=${MAX_LIMIT}&linked_partitioning=${LINK}`;
  const tracks = [];
  let res;

  try {
    do {
      res = await fetchScTracks(nextEndpoint).then(res => {
        if (res.status < 200 || res.status >= 300) {
          return Promise.reject(res);
        }
        return res;
      });

      tracks.push(...res.tracks);
      nextEndpoint = res.nextHref;
    } while (nextEndpoint);
  } catch (error) {
    return Promise.reject(error);
  }

  dispatch(importSongs(tracks));
};

export const getUserSoundcloudPlaylists = username => dispatch => {
  const playlistEndpoint = `${SC_API_BASE_URL}/users/${username}/playlists?client_id=${KEY}`;

  return fetch(playlistEndpoint)
    .then(res => {
      if (res.status < 200 || res.status >= 300) {
        return Promise.reject(res);
      }

      return res.json();
    })
    .then(data => {
      const newPlaylists = mapCollectionToPlaylists(data);

      dispatch(importPlaylists("soundcloud", newPlaylists));
    });
};

async function fetchScArtists(endpoint) {
  const res = await fetch(`${endpoint}`);
  const data = await res.json();

  return data.map(artist => ({
    name: artist.username,
    id: artist.id,
    numFollowers: artist.followers_count,
    img: artist.avatar_url
  }));
}

export const searchSoundcloudArtists = (query, limit = 5) => async dispatch => {
  const KEY = process.env.REACT_APP_SC_KEY || process.env.SOUNDCLOUD_CLIENT_ID;
  const endpoint = `https://api.soundcloud.com/users?q=${query}&client_id=${KEY}&limit=${limit}`;

  const artistList = await fetchScArtists(endpoint);

  dispatch({
    type: "SEARCH_SC_ARTISTS",
    payload: artistList
  });
};

export async function fetchScTracks(endpoint) {
  const res = await fetch(`${endpoint}&linked_partitioning=1`);
  if (res.status < 200 || res.status >= 300) {
    return Promise.reject(res.status);
  }

  const data = await res.json();

  const tracks = mapCollectionToTracks(data.collection);

  return {
    tracks,
    nextHref: data.next_href
  };
}

async function fetchScTrackSearch(query, limit) {
  const KEY = process.env.REACT_APP_SC_KEY || process.env.SOUNDCLOUD_CLIENT_ID;
  const trackSearchEndpoint = `https://api.soundcloud.com/tracks?q=${query}&limit=${limit}&format=json&client_id=${KEY}`;

  return fetchScTracks(trackSearchEndpoint);
}

// eslint-disable-next-line space-before-function-paren
export const loadMoreResults = () => async (dispatch, getState) => {
  const { nextHref } = getState().search;

  if (!nextHref || !nextHref.length) return;

  const collection = await fetchScTracks(nextHref);

  dispatch({
    type: "LOAD_MORE_SC_SONGS",
    payload: collection.tracks
  });

  dispatch({
    type: "SET_NEXT_SC_HREF",
    payload: collection.nextHref
  });
};

export const searchSouncloudTracks = (query, limit = 10) => async dispatch => {
  const collection = await fetchScTrackSearch(query, limit);

  dispatch({
    type: "SEARCH_SC_SONGS",
    payload: collection.tracks
  });

  dispatch({
    type: ADD_TO_SEARCH_HISTORY,
    payload: query
  });

  dispatch({
    type: "SET_NEXT_SC_HREF",
    payload: collection.nextHref
  });
};

async function fetchScSong(id) {
  const trackEndpoint = `https://api-v2.soundcloud.com/tracks/${id}?client_id=${KEY}`;

  const track = await fetch(trackEndpoint).json();

  return {
    title: track.title,
    id: track.id,
    artist: {
      name: track.user.username,
      img: track.user.avatar_url,
      id: track.user.id
    },
    // date: track.created_at,
    duration: track.full_duration,
    // likes: track.likes_count,
    // genre: track.genre,
    // uri: track.uri,
    // wave: track.waveform_url,
    // streamUrl: track.stream_url,
    streamable: track.streamable,
    img: track.artwork_url,
    source: "soundcloud"
  };
}

export const importScSong = id => async dispatch => {
  const song = await fetchScSong(id);

  dispatch({
    type: IMPORT_SONG,
    payload: song
  });
};

function mapCollectionToTracks(collection) {
  if (!collection) {
    throw new Error("Collection is invalid");
  }

  return collection.map(track => ({
    title: track.title,
    id: track.id,
    artist: {
      name: track.user.username,
      img: track.user.avatar_url,
      id: track.user.id
    },
    // date: track.created_at,
    duration: track.duration,
    // likes: track.likes_count,
    // genre: track.genre,
    // uri: track.uri,
    // wave: track.waveform_url,
    // streamUrl: track.stream_url,
    streamable: track.streamable,
    img: track.artwork_url,
    source: "soundcloud"
  }));
}

function mapCollectionToPlaylists(collection) {
  if (!collection) {
    throw new Error("Invalid soundcloud collection object");
  }

  return collection.map(item => ({
    id: item.id,
    title: item.title,
    images: item.artwork_url,
    externalUrl: item.permalink_url,
    source: "soundcloud",
    tracks: mapCollectionToTracks(item.tracks),
    next: "start",
    isConnected: false
  }));
}

function mapJsonToProfileObject(json) {
  return {
    fullName: json.full_name,
    username: json.permalink,
    displayName: json.username,
    id: json.id,
    image: json.avatar_url,
    profileUrl: json.permalink_url
  };
}
