import store from "../store";

export function setQuery(query) {
  return {
    type: "SET_QUERY",
    payload: query
  };
}

export function setTrackResults(source, tracks) {
  return {
    type: "SET_TRACK_RESULTS",
    source,
    payload: tracks
  };
}

export function setMoreTrackResults(source, tracks) {
  return {
    type: "SET_MORE_TRACK_RESULTS",
    source,
    payload: tracks
  };
}

export function setArtistResults(source, artists) {
  return {
    type: "SET_ARTIST_RESULTS",
    source,
    payload: artists
  };
}

export function addToSearchHistory(query) {
  return {
    type: "ADD_TO_SEARCH_HISTORY",
    payload: query
  };
}

export const searchMusic = query => dispatch => {
  const user = store.getState().user;
  // TODO query music here
};
