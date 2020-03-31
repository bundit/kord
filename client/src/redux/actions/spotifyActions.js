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
    payload: token,
    source: "spotify"
  });
  dispatch({
    type: "SET_CONNECTION",
    payload: true,
    source: "spotify"
  });
};

export const importSavedSpotifyTracks = (
  limit = 50,
  offset = 0
) => async dispatch => {
  let tracks = [];
  let data;
  do {
    data = await spotifyApi.getMySavedTracks({ limit, offset });

    const newTracks = data.items
      .map(trackData => trackData.track)
      .map(track => ({
        album: {
          title: track.album.name,
          id: track.album.id,
          externalUrl: track.album.external_urls.spotify
        },
        id: track.id,
        duration: track.duration_ms,
        title: track.name,
        artist: track.artists.map(artist => ({
          id: artist.id,
          name: artist.name
        })),
        source: "spotify"
      }));
    tracks.push(...newTracks);
    offset += limit;
  } while (data.items.length >= limit);

  dispatch({
    type: "IMPORT_SONGS",
    payload: tracks
  });
};

export const getUserSpotifyPlaylists = (
  limit = 50,
  offset = 0
) => async dispatch => {
  const data = await spotifyApi.getUserPlaylists({ limit, offset });
  const playlists = data.items.map(item => ({
    id: item.id,
    title: item.name,
    images: item.images,
    externalUrl: item.external_urls.spotify,
    source: "spotify",
    isConnected: false
  }));

  dispatch({
    type: "IMPORT_PLAYLISTS",
    source: "spotify",
    payload: playlists
  });
};

export const getSpotifyProfile = () => async dispatch => {
  const profile = spotifyApi.getMe();
};
