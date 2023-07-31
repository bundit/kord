import { fetchGeneric } from "../../utils/fetchGeneric";
import { cacheValue, loadCachedValue } from "../../utils/sessionStorage";
import {
  importLikes,
  importPlaylistTracks,
  importPlaylists,
  setNextPlaylistHref
} from "./libraryActions";
import {
  setArtistResults,
  setMoreTrackResults,
  setTrackResults
} from "./searchActions";
import { setUserProfile } from "./userActions";

const SC_API_V2 = "https://api-v2.soundcloud.com";

export const fetchSoundcloudProfileAndPlaylists = (username) => (dispatch) => {
  return dispatch(fetchSoundcloudProfile(username)).then(
    ({ likes, userId }) => {
      return dispatch(fetchSoundcloudPlaylists(userId)).then((playlists) => {
        const allPlaylists = [likes, ...playlists];
        dispatch(importPlaylists("soundcloud", allPlaylists));
      });
    }
  );
};

export const fetchSoundcloudProfile = (username) => (dispatch) => {
  const endpoint = `/api/soundcloud/user?username=${username}`;

  return fetchGeneric(endpoint).then((json) => {
    const profile = mapJsonToProfile(json);

    const userLikes = {
      id: "likes",
      title: "Soundcloud Likes",
      images: null,
      source: "soundcloud",
      tracks: [],
      total: json.likes_count,
      next: `/api/soundcloud/user/${profile.id}/likes`,
      isConnected: true,
      dateSynced: new Date(),
      externalUrl: profile.profileUrl + "/likes",
      isStarred: false
    };

    dispatch(setUserProfile("soundcloud", profile));

    return { likes: userLikes, userId: profile.id };
  });
};

export const fetchSoundcloudLikes = (next, userId) => (dispatch) => {
  if (!next) {
    next = `/api/soundcloud/user/${userId}/likes`;
  }

  return dispatch(fetchSoundcloudTracks(next)).then((fetchedTracks) => {
    dispatch(importLikes("soundcloud", fetchedTracks));

    return fetchedTracks;
  });
};

export const fetchSoundcloudPlaylists = (userId) => (dispatch) => {
  const playlistEndpoint = `/api/soundcloud/user/${userId}/playlist`;

  return fetchGeneric(playlistEndpoint).then((data) =>
    mapCollectionToPlaylists(data)
  );
};

export const fetchSoundcloudPlaylistTracks = (id, next) => (dispatch) => {
  const playlistEndpoint =
    next === "start"
      ? `/api/soundcloud/playlist/${id}`
      : `/api/soundcloud?url=${encodeURIComponent(next)}`;

  return fetchGeneric(playlistEndpoint).then((data) => {
    const { tracks, next } = mapTracksAndNextHref(data);

    dispatch(importPlaylistTracks("soundcloud", id, tracks));
    dispatch(setNextPlaylistHref("soundcloud", id, next));

    return { tracks };
  });
};

export const searchSoundcloud = (query) => (dispatch) => {
  const requests = [searchSoundcloudTracks, searchSoundcloudArtists];

  return Promise.all(requests.map((request) => dispatch(request(query))));
};

export const searchSoundcloudTracks =
  (query, limit = 50) =>
  (dispatch) => {
    const trackSearchEndpoint = `/api/soundcloud/search/tracks?q=${query}`;

    const storageKey = `SC:${query}:artists`;

    const cachedSearch = loadCachedValue(storageKey);
    if (cachedSearch) {
      dispatch(setTrackResults("soundcloud", cachedSearch));
      return Promise.resolve();
    }

    return dispatch(fetchSoundcloudTracks(trackSearchEndpoint)).then(
      ({ tracks, next }) => {
        dispatch(setTrackResults("soundcloud", { list: tracks, next }));
        cacheValue(storageKey, { list: tracks, next });
      }
    );
  };

export const fetchMoreSoundcloudTrackResults = (next) => (dispatch) => {
  return dispatch(fetchSoundcloudTracks(next)).then(({ tracks, next }) => {
    dispatch(setMoreTrackResults("soundcloud", { list: tracks, next }));
  });
};

export const searchSoundcloudArtists =
  (query, limit = 5) =>
  (dispatch) => {
    const artistSearchEndpoint = `/api/soundcloud/search/artists?q=${query}`;

    return fetchScArtists(artistSearchEndpoint).then((artistList) =>
      dispatch(setArtistResults("soundcloud", artistList))
    );
  };

function fetchScArtists(endpoint) {
  return fetchGeneric(endpoint).then((json) => mapJsonToArtists(json));
}

export const fetchRelatedSouncloudTracks = (trackId) => (dispatch) => {
  const relatedTracksEndpoint = `/api/soundcloud/track/${trackId}/related`;
  /*
    {collection: SoundcloudTrack[], query_urn: string "soundcloud:similarsounds:80c57193b98543a49c3c8863f43dee3a"
}
  */

  return dispatch(fetchSoundcloudTracks(relatedTracksEndpoint)).then(
    ({ tracks, next }) => tracks
  );
};

export const fetchSoundcloudArtist = (artistId) => (dispatch) => {
  return fetchGeneric(`/api/soundcloud/artist/${artistId}`).then((json) =>
    mapSoundcloudArtist(json)
  );
};

// TODO: Doesn't seem to be used currently
export const fetchSoundcloudSpotlight = (artistId) => (dispatch) => {
  const artistSpotlightEndpoint = `${SC_API_V2}/users/${artistId}/spotlight?&limit=20&linked_partitioning=1`;

  return fetchGeneric(artistSpotlightEndpoint).then((json) =>
    mapCollectionToPlaylistsOrTracks(json.collection)
  );
};

export const fetchSoundcloudArtistTopTracks = (artistId) => (dispatch) => {
  const artistTopTracksEndpoint = `/api/soundcloud/artist/${artistId}/toptracks`;

  return dispatch(fetchSoundcloudTracks(artistTopTracksEndpoint));
};

export const fetchSoundcloudArtistTracks = (artistId) => (dispatch) => {
  const artistTracksEndpoint = `/api/soundcloud/artist/${artistId}/tracks`;

  return dispatch(fetchSoundcloudTracks(artistTracksEndpoint));
};

export const fetchSoundcloudTracks = (endpoint) => (dispatch) => {
  if (endpoint.includes("api-v2")) {
    endpoint = `/api/soundcloud?url=${encodeURIComponent(endpoint)}`;
  }

  return fetchGeneric(endpoint).then((json) => mapTracksAndNextHref(json));
};

function mapTracksAndNextHref(json) {
  return {
    next: json.next_href,
    tracks: mapCollectionToTracks(json.collection || json.tracks)
  };
}

function mapCollectionToPlaylistsOrTracks(collection) {
  return collection.map((item) =>
    item.kind === "playlist" ? mapSoundcloudPlaylist(item) : mapToTrack(item)
  );
}

function mapSoundcloudPlaylist(playlist) {
  return {
    id: playlist.id,
    url: playlist.permalink_url,
    title: playlist.title,
    artist: {
      id: playlist.user.id,
      img: playlist.user.avatar_url,
      name: playlist.user.username,
      permalink: playlist.user.permalink
    },
    kind: "playlist",
    tracks: mapCollectionToTracks(playlist.tracks)
  };
}

function mapSoundcloudArtist(json) {
  return {
    img: json.avatar_url,
    url: json.permalink_url,
    name: json.username,
    followers_count: json.followers_count,
    track_count: json.track_count,
    source: "soundcloud"
  };
}

export function mapCollectionToTracks(collection) {
  if (!collection) {
    throw new Error("Collection is invalid");
  }

  return collection
    .map((track) => track.track || track.playlist || track)
    .filter((track) => track.title && track.kind === "track")
    .map((track) => mapToTrack(track));
}

export function mapToTrack(track) {
  return {
    title: track.title,
    id: track.id,
    duration: track.duration,
    img: track.artwork_url,
    artist: track.user && {
      name: track.user.username,
      img: track.user.avatar_url,
      id: track.user.id
    },
    permalink: track.user
      ? `${track.user.permalink}/${track.permalink}`
      : track.permalink,
    type: track.type,
    source: "soundcloud",
    streamable: true,
    mediaUrl: track.media.transcodings.find(
      ({ format: { protocol } }) => protocol === "progressive"
    )?.url
  };
}

function mapCollectionToPlaylists(json) {
  if (!json?.collection) {
    throw new Error("Invalid soundcloud collection object");
  }

  return json.collection.map((item) => ({
    id: item.id,
    title: item.title,
    img: item.artwork_url,
    externalUrl: item.permalink_url,
    source: "soundcloud",
    tracks: mapCollectionToTracks(item.tracks),
    total: item.tracks.length,
    isConnected: true,
    dateSynced: null,
    isStarred: false
  }));
}

function mapJsonToProfile(json) {
  return {
    fullName: json.full_name,
    username: json.permalink,
    displayName: json.username,
    id: json.id,
    image: json.avatar_url,
    profileUrl: json.permalink_url,
    isConnected: true
  };
}

function mapJsonToArtists(json) {
  return json.collection.map((artist) => ({
    name: artist.username,
    id: artist.id,
    numFollowers: artist.followers_count,
    img: artist.avatar_url,
    source: "soundcloud"
  }));
}
