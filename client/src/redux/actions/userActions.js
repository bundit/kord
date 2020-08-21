import {
  SAVE_ROUTE,
  SET_ACCESS_TOKEN,
  SET_CONNECTION,
  SET_CURRENT_PAGE,
  SET_KORD_ID,
  SET_MAIN_CONNECTION,
  SET_PROFILE,
  SET_SETTINGS_OPEN_STATUS,
  SET_SETTINGS_SOURCE
} from "./types";
import { fetchPlaylists } from "./libraryActions";
import { fetchSoundcloudProfile } from "./soundcloudActions";
import { fetchSpotifyProfile } from "./spotifyActions";
import { fetchYoutubeProfile } from "./youtubeActions";

export const setKordId = userId => {
  return {
    type: SET_KORD_ID,
    payload: userId
  };
};

export const setAccessToken = (source, token) => {
  return {
    type: SET_ACCESS_TOKEN,
    source,
    payload: token
  };
};

export const setConnection = (source, isConnected) => {
  return {
    type: SET_CONNECTION,
    source,
    payload: isConnected
  };
};

export const setMainConnection = source => {
  return {
    type: SET_MAIN_CONNECTION,
    payload: source
  };
};

export const setUserProfile = (source, profile) => {
  return {
    type: SET_PROFILE,
    source,
    payload: profile
  };
};

export const fetchProfile = (source, user) => dispatch => {
  if (source === "spotify") {
    return dispatch(fetchSpotifyProfile());
  } else if (source === "soundcloud") {
    return dispatch(fetchSoundcloudProfile(user));
  } else if (source === "youtube") {
    return dispatch(fetchYoutubeProfile());
  }
};

export const fetchProfileAndPlaylists = (source, user) => dispatch => {
  return dispatch(fetchProfile(source, user)).then(() =>
    dispatch(fetchPlaylists(source, user))
  );
};

export const saveRoute = (relativeRoute, route) => {
  return {
    type: SAVE_ROUTE,
    relativeRoute,
    payload: route
  };
};

export const setCurrentPage = page => {
  return {
    type: SET_CURRENT_PAGE,
    payload: page
  };
};

const setIsSettingsOpen = isOpen => {
  return {
    type: SET_SETTINGS_OPEN_STATUS,
    payload: isOpen
  };
};

const setSettingsSource = source => {
  return {
    type: SET_SETTINGS_SOURCE,
    payload: source
  };
};

export const openSettings = source => dispatch => {
  dispatch(setIsSettingsOpen(true));
  dispatch(setSettingsSource(source));
};

export const closeSettings = () => dispatch => {
  dispatch(setIsSettingsOpen(false));
};

export const updateProfile = (source, user) => dispatch => {
  return dispatch(fetchProfileAndPlaylists(source, user));
};
