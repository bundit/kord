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
