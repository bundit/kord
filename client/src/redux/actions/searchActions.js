import {
  SEARCH,
  SEARCH_ARTISTS,
  ADD_TO_SEARCH_HISTORY,
  SET_NEXT_HREF,
  LOAD_MORE_RESULTS
} from "./types";

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
  const KEY = process.env.REACT_APP_SC_KEY;
  const endpoint = `https://api.soundcloud.com/users?q=${query}&client_id=${KEY}&limit=${limit}`;

  const artistList = await fetchScArtists(endpoint);

  dispatch({
    type: SEARCH_ARTISTS,
    payload: artistList
  });
};

export async function fetchScTracks(endpoint) {
  const res = await fetch(`${endpoint}&linked_partitioning=1`);
  const data = await res.json();

  const tracks = data.collection.map(track => ({
    title: track.title,
    id: track.id,
    artist: {
      name: track.user.username,
      img: track.user.avatar_url,
      id: track.user.id
    },
    date: track.created_at,
    duration: track.duration,
    likes: track.likes_count,
    genre: track.genre,
    uri: track.uri,
    wave: track.waveform_url,
    streamUrl: track.stream_url,
    streamable: track.streamable,
    img: track.artwork_url,
    source: "soundcloud"
  }));

  return {
    tracks,
    nextHref: data.next_href
  };
}

async function fetchScTrackSearch(query, limit) {
  const KEY = process.env.REACT_APP_SC_KEY;
  const trackSearchEndpoint = `https://api.soundcloud.com/tracks?q=${query}&limit=${limit}&format=json&client_id=${KEY}`;

  return fetchScTracks(trackSearchEndpoint);
}

// eslint-disable-next-line space-before-function-paren
export const loadMoreResults = () => async (dispatch, getState) => {
  const { nextHref } = getState().search;

  if (!nextHref || !nextHref.length) return;

  const collection = await fetchScTracks(nextHref);

  dispatch({
    type: LOAD_MORE_RESULTS,
    payload: collection.tracks
  });

  dispatch({
    type: SET_NEXT_HREF,
    payload: collection.nextHref
  });
};

export const searchSouncloudTracks = (query, limit = 10) => async dispatch => {
  const collection = await fetchScTrackSearch(query, limit);

  dispatch({
    type: SEARCH,
    payload: collection.tracks
  });

  dispatch({
    type: ADD_TO_SEARCH_HISTORY,
    payload: query
  });

  dispatch({
    type: SET_NEXT_HREF,
    payload: collection.nextHref
  });
};

export const searchSpotify = (
  query,
  scope,
  token,
  limit = 10
) => async dispatch => {
  const url = `https://api.spotify.com/v1/search?q=${query}&type=${scope}&limit=${limit}`;
  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  };

  // const collection = await fetch(url, options);
  fetch(url, options)
    .then(res => (res.status === 200 ? res.json() : res))
    .then(json => console.log(json))
    .then(i => (window.search = i))
    .catch(object => console.log(object.type, object.message));
};
