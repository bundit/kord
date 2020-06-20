import { YTDurationToMilliseconds } from "../../utils/YTDurationToMilliseconds";
import { fetchGeneric } from "../../utils/fetchGeneric";
import {
  importPlaylistTracks,
  importPlaylists,
  setNextPlaylistHref
} from "./libraryActions";
import { setAccessToken, setConnection, setUserProfile } from "./userActions";
import store from "../store";

export const setYoutubeAccessToken = accessToken => dispatch => {
  dispatch(setAccessToken("youtube", accessToken));
  dispatch(setConnection("youtube", true));
};

export const refreshYoutubeToken = () => dispatch => {
  return fetchGeneric(`/auth/google/refresh`).then(json => {
    dispatch(setYoutubeAccessToken(json.accessToken));
    return json.accessToken;
  });
};

export const fetchYoutubeProfile = (tries = 3) => dispatch => {
  const endpoint = `https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true&key=${process.env.REACT_APP_YT_KEY}`;
  const opts = generateYoutubeFetchOptionsAndHeaders();

  return fetchGeneric(endpoint, opts)
    .then(json => {
      const profile = mapJsonToProfile(json);

      dispatch(setUserProfile("youtube", profile));
    })
    .catch(e => {
      if (tries) {
        return dispatch(errorHandler(e)).then(() =>
          dispatch(fetchYoutubeProfile(--tries))
        );
      } else return Promise.reject(e);
    });
};

export const fetchYoutubePlaylists = (limit = 50, tries = 3) => dispatch => {
  const endpoint = `https://www.googleapis.com/youtube/v3/playlists?part=snippet%2CcontentDetails%2Cid&maxResults=${limit}&mine=true&key=${process.env.REACT_APP_YT_KEY}`;
  const opts = generateYoutubeFetchOptionsAndHeaders();

  return fetchGeneric(endpoint, opts)
    .then(json => {
      const playlists = mapJsonToPlaylists(json);

      dispatch(importPlaylists("youtube", playlists));
    })
    .catch(e => {
      if (tries) {
        return dispatch(errorHandler(e)).then(() =>
          dispatch(fetchYoutubePlaylists(limit, --tries))
        );
      } else return Promise.reject(e);
    });
};

export const fetchYoutubePlaylistTracks = (
  id,
  next,
  limit = 50,
  tries = 3
) => dispatch => {
  let playlistEndpoint;
  const opts = generateYoutubeFetchOptionsAndHeaders();

  if (next === "start") {
    playlistEndpoint = `https://www.googleapis.com/youtube/v3/playlistItems?part=id%2Csnippet&maxResults=${limit}&playlistId=${id}&key=${process.env.REACT_APP_YT_KEY}`;
  } else {
    playlistEndpoint = next;
  }

  return fetchGeneric(playlistEndpoint, opts)
    .then(json => {
      const tracks = mapJsonToTracks(json).filter(
        tracks => tracks.title !== "Private video"
      );

      const next =
        json.nextPageToken &&
        `https://www.googleapis.com/youtube/v3/playlistItems?pageToken=${json.nextPageToken}&part=id%2Csnippet&maxResults=${limit}&playlistId=${id}&key=${process.env.REACT_APP_YT_KEY}`;
      dispatch(setNextPlaylistHref("youtube", id, next));

      return { tracks, next };
    })
    .then(({ tracks, next }) => {
      const videoIds = tracks.map(track => track.id);

      return fetchYoutubeTrackInfo(videoIds).then(json => {
        json.items.forEach(item => {
          tracks = tracks.map(track => {
            if (track.id === item.id) {
              track = {
                ...track,
                ...mapDurationAndChannelToTracks(item)
              };
            }
            return track;
          });
        });

        dispatch(importPlaylistTracks("youtube", id, tracks));

        return { tracks, next };
      });
    })
    .catch(e => {
      if (tries) {
        return dispatch(errorHandler(e)).then(() =>
          dispatch(fetchYoutubePlaylistTracks(id, next, limit, --tries))
        );
      } else return Promise.reject(e);
    });
};

function fetchYoutubeTrackInfo(videoIds) {
  const videoEndpoint = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails%2Csnippet&id=${videoIds}&key=${process.env.REACT_APP_YT_KEY}`;

  return fetchGeneric(videoEndpoint);
}

function errorHandler(err, tries = 3) {
  return dispatch => {
    if (!tries) {
      return Promise.reject(err);
    }

    if (err.status === 401) {
      return dispatch(refreshYoutubeToken());
    }

    return dispatch(errorHandler(err, --tries));
  };
}

function generateYoutubeFetchOptionsAndHeaders() {
  const youtubeToken = store.getState().user.youtube.token;

  return {
    method: "GET",
    headers: {
      Authorization: `Bearer ${youtubeToken}`,
      Accept: "application/json"
    }
  };
}

function mapJsonToProfile(json) {
  json = json.items[0];
  return {
    username: json.snippet.title,
    image: json.snippet.thumbnails.medium.url,
    profileUrl: `https://www.youtube.com/channel/${json.id}?view_as=subscriber`,
    id: json.id
  };
}

function mapJsonToPlaylists(json) {
  return json.items.map(item => ({
    id: item.id,
    title: item.snippet.localized.title,
    description: item.snippet.localized.description,
    img: item.snippet.thumbnails,
    source: "youtube",
    tracks: [],
    total: item.contentDetails.itemCount,
    next: "start",
    isConnected: true,
    dateSynced: null
  }));
}

function mapJsonToTracks(json) {
  return json.items.map(item => ({
    id: item.snippet.resourceId.videoId,
    title: item.snippet.title,
    img: item.snippet.thumbnails,
    streamable: true,
    source: "youtube"
  }));
}

function mapDurationAndChannelToTracks(item) {
  return {
    duration: YTDurationToMilliseconds(item.contentDetails.duration),
    artist: {
      id: item.snippet.channelId,
      name: item.snippet.channelTitle
    }
  };
}
