import { getSoundcloudProfile } from "./soundcloudActions";
import { setSpotifyProfile } from "./spotifyActions";

export const setAccessToken = (source, token) => {
  return {
    type: "SET_ACCESS_TOKEN",
    source,
    payload: token
  };
};

export const setConnection = (source, isConnected) => {
  return {
    type: "SET_CONNECTION",
    source,
    payload: isConnected
  };
};

export const setUserProfile = (source, profile) => {
  return {
    type: "SET_PROFILE",
    source,
    payload: profile
  };
};

export const fetchProfile = (source, user) => dispatch => {
  if (source === "spotify") {
    return dispatch(setSpotifyProfile());
  } else if (source === "soundcloud") {
    return dispatch(getSoundcloudProfile(user));
  }
};
