import { IMPORT_SC_LIKES, IMPORT_SONG } from "./types";
import { fetchScTracks } from "./searchActions";

const KEY = process.env.REACT_APP_SC_KEY;
const MAX_LIMIT = 200;
const LINK = 1;
const SC_API_BASE_URL = "https://api.soundcloud.com";

/**
 * fetchScSong - fetch wrapper for fetching one track from soundcloud
 *
 * @param  {number} id soundcloud track id
 * @return {object} an object containing json data about the track
 */
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
  };
}

export const importScSong = id => async dispatch => {
  const song = await fetchScSong(id);

  dispatch({
    type: IMPORT_SONG,
    payload: song
  });
};

export const importScLikes = username => async dispatch => {
  let nextEndpoint = `${SC_API_BASE_URL}/users/${username}/favorites?client_id=${KEY}&limit=${MAX_LIMIT}&linked_partitioning=${LINK}`;
  const tracks = [];
  let res;

  do {
    // We must use the previous request's result to make the next request
    // eslint-disable-next-line no-await-in-loop
    res = await fetchScTracks(nextEndpoint);

    // Add the results to list of songs
    tracks.push(...res.tracks);

    // Set the endpoint to the next pagination
    nextEndpoint = res.nextHref;
  } while (res.nextHref);

  // Send the payload to reducer
  dispatch({
    type: IMPORT_SC_LIKES,
    payload: tracks
  });
};
