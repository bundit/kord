import {
  DEQUE_ROUTE,
  REMOVE_PROFILE,
  SAVE_ROUTE,
  SET_ACCESS_TOKEN,
  SET_CONNECTION,
  SET_CURRENT_TRACK_DROPDOWN,
  SET_KORD_ID,
  SET_MAIN_CONNECTION,
  SET_PROFILE,
  SET_SETTINGS_OPEN_STATUS,
  SET_SETTINGS_SOURCE,
  TOGGLE_ADD_TO_PLAYLIST_FORM,
  TOGGLE_DELETE_TRACK_FORM,
  TOGGLE_KEYBOARD_CONTROLS_MENU,
  TOGGLE_USER_QUEUE
} from "./types";
import { fetchGeneric } from "../../utils/fetchGeneric";
import { fetchSoundcloudProfileAndPlaylists } from "./soundcloudActions";
import { fetchSpotifyProfileAndPlaylists } from "./spotifyActions";
import { fetchYoutubeProfileAndPlaylists } from "./youtubeActions";
import { removePlaylists } from "./libraryActions";

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

const removeProfile = source => {
  return {
    type: REMOVE_PROFILE,
    payload: source
  };
};

export const fetchProfileAndPlaylists = (source, user) => dispatch => {
  const request = {
    spotify: fetchSpotifyProfileAndPlaylists,
    soundcloud: fetchSoundcloudProfileAndPlaylists,
    youtube: fetchYoutubeProfileAndPlaylists
  };

  return dispatch(request[source](user));
};

export const saveRoute = (relativeRoute, route) => {
  return {
    type: SAVE_ROUTE,
    relativeRoute,
    payload: route
  };
};

export const dequeRoute = (relativeRoute, pathname) => {
  return {
    type: DEQUE_ROUTE,
    pathname,
    payload: relativeRoute
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

export const toggleAddToPlaylistForm = () => {
  return {
    type: TOGGLE_ADD_TO_PLAYLIST_FORM
  };
};

export const toggleDeleteTrackForm = () => {
  return {
    type: TOGGLE_DELETE_TRACK_FORM
  };
};

export const toggleUserQueue = () => {
  return {
    type: TOGGLE_USER_QUEUE
  };
};

export const toggleKeyboardControlsMenu = () => {
  return {
    type: TOGGLE_KEYBOARD_CONTROLS_MENU
  };
};

const setCurrentTrackDropdown = track => {
  return {
    type: SET_CURRENT_TRACK_DROPDOWN,
    payload: track
  };
};

export const openAddToPlaylistForm = track => dispatch => {
  dispatch(setCurrentTrackDropdown(track));
  dispatch(toggleAddToPlaylistForm());
};

export const openDeleteTrackForm = (playlistId, track, index) => dispatch => {
  track = { ...track, index, playlistId };
  dispatch(setCurrentTrackDropdown(track));
  dispatch(toggleDeleteTrackForm());
};

export const removeUserProfile = source => dispatch => {
  return fetchGeneric(`/user/profiles?provider=${source}`, {
    method: "DELETE"
  }).then(() => {
    dispatch(removeProfile(source));
    dispatch(removePlaylists(source));
  });
};

export const fetchUserProfiles = exclude => dispatch => {
  return fetchGeneric(`/user/profiles?exclude=${exclude}`).then(json => {
    json.forEach(({ source, ...profile }) => {
      if (source !== "google") {
        dispatch(setUserProfile(source, profile));
      }
    });
  });
};
