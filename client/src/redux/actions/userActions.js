import { setSpotifyAccessToken } from "./spotifyActions";

export const setAccessToken = (source, token) => dispatch => {
  if (source === "spotify") {
    dispatch(setSpotifyAccessToken(token));
  }
};
