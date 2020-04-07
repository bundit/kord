import { setSpotifyAccessToken } from "./spotifyActions";

export const setAccessToken = (source, token) => dispatch => {
  if (source === "spotify") {
    dispatch(setSpotifyAccessToken(token));
  }
};

export const setUserProfile = (source, profile) => {
  return {
    type: "SET_PROFILE",
    source,
    payload: profile
  };
};
