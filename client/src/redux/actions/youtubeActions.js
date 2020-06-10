import { fetchGeneric } from "../../utils/fetchGeneric";
import { importPlaylists } from "./libraryActions";
import { setAccessToken, setConnection, setUserProfile } from "./userActions";

let youtubeToken;

export const setYoutubeAccessToken = accessToken => dispatch => {
  youtubeToken = accessToken;

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
  const opts = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${youtubeToken}`,
      Accept: "application/json"
    }
  };

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

export const fetchUserYoutubePlaylists = (
  limit = 50,
  tries = 3
) => dispatch => {
  const endpoint = `https://www.googleapis.com/youtube/v3/playlists?part=snippet%2CcontentDetails%2Cid&maxResults=${limit}&mine=true&key=${process.env.REACT_APP_YT_KEY}`;
  const opts = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${youtubeToken}`,
      Accept: "application/json"
    }
  };

  return fetchGeneric(endpoint, opts)
    .then(json => {
      const playlists = mapJsonToPlaylists(json);

      dispatch(importPlaylists("youtube", playlists));
    })
    .catch(e => {
      if (tries) {
        return dispatch(errorHandler(e)).then(() =>
          dispatch(fetchUserYoutubePlaylists(limit, --tries))
        );
      } else return Promise.reject(e);
    });
};

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
    dateSynced: new Date()
  }));
}
