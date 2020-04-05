import SpotifyWebApi from "spotify-web-api-js";

const spotifyApi = new SpotifyWebApi();

export const setSpotifyAccessToken = token => dispatch => {
  spotifyApi.setAccessToken(token);

  dispatch({
    type: "SET_ACCESS_TOKEN",
    payload: token,
    source: "spotify"
  });
  dispatch({
    type: "SET_CONNECTION",
    payload: true,
    source: "spotify"
  });
};

export const refreshSpotifyToken = () => dispatch => {
  return fetch(`/auth/spotify/refresh`)
    .then(res => res.json())
    .then(obj => {
      dispatch(setSpotifyAccessToken(obj.accessToken));
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
    const newTracks = mapSpotifyResponseToTrackObjects(data);
    tracks.push(...newTracks);

    offset += limit;
    //
  } while (data.items.length >= limit);

  dispatch({
    type: "IMPORT_SONGS",
    payload: tracks
  });
};

export const getUserSpotifyPlaylists = (
  limit = 50,
  offset = 0,
  tries = 3
) => async dispatch => {
  spotifyApi.getUserPlaylists({ limit, offset }, (err, data) => {
    if (err) {
      return dispatch(errorHandler(err)).then(() =>
        dispatch(getUserSpotifyPlaylists(limit, offset, --tries))
      );
    }
    const playlists = data.items.map(item => ({
      id: item.id,
      title: item.name,
      images: item.images,
      externalUrl: item.external_urls.spotify,
      source: "spotify",
      tracks: [],
      next: "start",
      isConnected: false
    }));

    dispatch({
      type: "IMPORT_PLAYLISTS",
      source: "spotify",
      payload: playlists
    });
  });
};

export const getSpotifyPlaylistTracks = (id, next) => async dispatch => {
  let data;

  if (!next) {
    return;
  } else if (next === "start") {
    data = spotifyApi.getPlaylistTracks(id);
  } else {
    data = spotifyApi.getGeneric(next);
  }

  data.then(
    data => {
      const newTracks = mapSpotifyResponseToTrackObjects(data);

      dispatch({
        type: "IMPORT_PLAYLIST_TRACKS",
        source: "spotify",
        playlistId: id,
        payload: newTracks
      });

      dispatch({
        type: "SET_NEXT_PLAYLIST_HREF",
        source: "spotify",
        playlistId: id,
        payload: data.next
      });
    },
    err => {
      return dispatch(errorHandler(err)).then(() =>
        dispatch(getSpotifyPlaylistTracks(id, next))
      );
    }
  );
};

export const getSpotifyProfile = () => async dispatch => {
  const profile = await spotifyApi.getMe();
};

function errorHandler(err) {
  return dispatch => {
    console.log("error happend");
    if (err.status === 401) {
      return dispatch(refreshSpotifyToken());
    }
  };
}

function mapSpotifyResponseToTrackObjects(data) {
  return data.items
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
      img: track.album.images,
      source: "spotify"
    }));
}
