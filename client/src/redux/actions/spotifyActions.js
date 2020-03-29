import SpotifyWebApi from "spotify-web-api-js";

const spotifyApi = new SpotifyWebApi();

// Async try catch wrapper for
async function tryWrapper(callback) {
  return async function() {
    try {
      return await callback.apply(this, arguments);
    } catch (e) {
      console.err(`Error: ${e.stack}`);
    }
  };
}

export const setSpotifyAccessToken = token => dispatch => {
  spotifyApi.setAccessToken(token);

  dispatch({
    type: "SET_SPOTIFY_ACCESS_TOKEN",
    payload: token
  });
};

export const getUserSpotifyPlaylists = (
  limit = 50,
  offset
) => async dispatch => {
  return await spotifyApi.getUserPlaylists(limit, offset);
};

export const getSpotifyProfile = () => async dispatch => {
  const profile = spotifyApi.getMe();
};
