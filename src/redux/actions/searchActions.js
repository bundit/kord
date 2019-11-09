import {
  SEARCH,
  ADD_TO_SEARCH_HISTORY,
  SET_NEXT_HREF,
  LOAD_MORE_RESULTS
} from "./types";

async function fetchScTracks(endpoint) {
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
    duration: track.full_duration,
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
