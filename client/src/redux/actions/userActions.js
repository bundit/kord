import { setSpotifyAccessToken, setSpotifyProfile } from "./spotifyActions";

export const setAccessToken = (source, token) => dispatch => {
  if (source === "spotify") {
    dispatch(setSpotifyAccessToken(token));
  }
};

export const setUserProfile = source => dispatch => {
  if (source === "spotify") {
    dispatch(setSpotifyProfile());
  }
};
