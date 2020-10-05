import {
  ADD_TO_SEARCH_HISTORY,
  REMOVE_FROM_SEARCH_HISTORY,
  SET_ARTIST_RESULTS,
  SET_AUTOCOMPLETE_RESULTS,
  SET_MORE_TRACK_RESULTS,
  SET_QUERY,
  SET_TRACK_RESULTS
} from "./types";
import { fetchGeneric } from "../../utils/fetchGeneric";
import {
  fetchMoreSoundcloudTrackResults,
  fetchSoundcloudArtist,
  fetchSoundcloudArtistTopTracks,
  fetchSoundcloudArtistTracks,
  fetchSoundcloudTracks,
  searchSoundcloudTracks
} from "./soundcloudActions";
import {
  fetchMoreSpotifyTrackResults,
  fetchSpotifyArtist,
  fetchSpotifyArtistTopTracks,
  fetchSpotifyArtistTracks,
  fetchSpotifyTracks,
  searchSpotify
} from "./spotifyActions";
import {
  fetchMoreYoutubeTrackResults,
  fetchYoutubeArtist,
  fetchYoutubeArtistTopTracks,
  fetchYoutubeArtistTracks,
  fetchYoutubeTracks,
  searchYoutube
} from "./youtubeActions";

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

export function setAutoCompleteResults(results) {
  return {
    type: SET_AUTOCOMPLETE_RESULTS,
    payload: results
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

export const fetchAutoCompleteResults = query => dispatch => {
  return fetchGeneric(
    `https://cors-anywhere.herokuapp.com/http://suggestqueries.google.com/complete/search?client=chrome&ds=yt&q=${query}`
  ).then(res => dispatch(setAutoCompleteResults(res[1])));
};

export const fetchArtist = (artistId, source) => dispatch => {
  const requests = {
    soundcloud: fetchSoundcloudArtist,
    spotify: fetchSpotifyArtist,
    youtube: fetchYoutubeArtist
  };

  return dispatch(requests[source](artistId));
};

export const fetchArtistTracks = (
  artistId,
  source,
  type,
  artistName
) => dispatch => {
  const requests = {
    soundcloud: {
      allTracks: fetchSoundcloudArtistTracks,
      topTracks: fetchSoundcloudArtistTopTracks
    },
    spotify: {
      allTracks: fetchSpotifyArtistTracks,
      topTracks: fetchSpotifyArtistTopTracks
    },
    youtube: {
      allTracks: fetchYoutubeArtistTracks,
      topTracks: fetchYoutubeArtistTopTracks
    }
  };

  return dispatch(requests[source][type](artistId, artistName));
};

export const fetchMoreArtistTracks = (next, source) => dispatch => {
  const requests = {
    soundcloud: fetchSoundcloudTracks,
    spotify: fetchSpotifyTracks,
    youtube: fetchYoutubeTracks
  };

  return dispatch(requests[source](next));
};
