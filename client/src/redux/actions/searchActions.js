import {
  ADD_TO_SEARCH_HISTORY,
  REMOVE_FROM_SEARCH_HISTORY,
  SET_ARTIST_RESULTS,
  SET_MORE_TRACK_RESULTS,
  SET_QUERY,
  SET_TRACK_RESULTS
} from "./types";
import {
  fetchMoreSoundcloudTrackResults,
  searchSoundcloudTracks
} from "./soundcloudActions";
import { fetchMoreSpotifyTrackResults, searchSpotify } from "./spotifyActions";
import { fetchMoreYoutubeTrackResults, searchYoutube } from "./youtubeActions";

export function setQuery(query) {
  return {
    type: SET_QUERY,
    payload: query
  };
}

export function setTrackResults(source, tracks) {
  return {
    type: SET_TRACK_RESULTS,
    source,
    payload: tracks
  };
}

export function setMoreTrackResults(source, tracks) {
  return {
    type: SET_MORE_TRACK_RESULTS,
    source,
    payload: tracks
  };
}

export function setArtistResults(source, artists) {
  return {
    type: SET_ARTIST_RESULTS,
    source,
    payload: artists
  };
}

export function addToSearchHistory(query) {
  return {
    type: ADD_TO_SEARCH_HISTORY,
    payload: query
  };
}

export function removeFromSearchHistory(query) {
  return {
    type: REMOVE_FROM_SEARCH_HISTORY,
    payload: query
  };
}

export const searchForMusic = (source, query) => dispatch => {
  let request;

  if (source === "soundcloud") {
    request = searchSoundcloudTracks;
  }

  if (source === "spotify") {
    request = searchSpotify;
  }

  if (source === "youtube") {
    request = searchYoutube;
  }

  if (request) {
    return dispatch(request(query));
  }

  return Promise.resolve();
};

export const loadMoreTrackResults = (source, next) => dispatch => {
  if (!next) return Promise.reject("No more results");

  if (source === "soundcloud") {
    return dispatch(fetchMoreSoundcloudTrackResults(next));
  } else if (source === "spotify") {
    return dispatch(fetchMoreSpotifyTrackResults(next));
  } else if (source === "youtube") {
    return dispatch(fetchMoreYoutubeTrackResults(next));
  }
};
