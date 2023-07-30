import {
  Request as ExpressRequest,
  Response as ExpressResponse
} from "express";
import { isString, keyBy, set } from "lodash";
import fetch, { Response as FetchResponse } from "node-fetch";
import {
  SoundcloudGetUserPlaylistsResponse,
  SoundcloudPlaylist,
  SoundcloudTrack,
  SoundcloudTrackLite
} from "../types/common/soundcloud";

const KeyService = require("../services/keys");

const SC_API_V2_BASE = "https://api-v2.soundcloud.com";

function formatEndpointHref(endpoint: string, key: string): string {
  const concatChar = endpoint.includes("?") ? "&" : "?";

  return `${endpoint}${concatChar}client_id=${key}`;
}

async function fetchSoundcloud(
  endpoint: string,
  retriesRemaining: number = 1
): Promise<FetchResponse> {
  try {
    const response = await fetch(
      formatEndpointHref(endpoint, KeyService.soundcloudClientId)
    );

    const shouldRetry = response.status === 403 || response.status === 401;

    if (shouldRetry && retriesRemaining > 0) {
      await KeyService.refreshSoundcloudClientId();

      return fetchSoundcloud(endpoint, retriesRemaining - 1);
    }

    return response;
  } catch (e) {
    throw e;
  }
}

async function fetchSoundcloudAndPipeResponse(
  endpoint: string,
  res: ExpressResponse
): Promise<ExpressResponse> {
  try {
    const response = await fetchSoundcloud(endpoint);
    return response.body.pipe(res);
  } catch (e) {
    console.error(e);
    return res.status(500).end();
  }
}

function getSoundcloudSearchResults(req: ExpressRequest, res: ExpressResponse) {
  const {
    query: { url }
  } = req;

  if (typeof url !== "string" || !url) {
    return res.status(500);
  }

  const decodedUrl = decodeURIComponent(url);

  const urlObject = new URL(decodedUrl);

  const isSoundcloudApiEndpoint = urlObject.origin === SC_API_V2_BASE;
  const isHttps = urlObject.protocol === "https:";

  if (!isSoundcloudApiEndpoint || !isHttps) {
    return res.status(500).end();
  }

  return fetchSoundcloudAndPipeResponse(decodedUrl, res);
}

async function getSuggestedAutocomplete(
  req: ExpressRequest,
  res: ExpressResponse
) {
  const {
    query: { q }
  } = req;
  const searchAutocompleteEndpoint =
    "http://suggestqueries.google.com/complete/search?client=chrome&ds=yt";

  if (!isString(q) || !q) {
    return res.status(500);
  }

  const autoCompleteResponse = await fetch(
    `${searchAutocompleteEndpoint}&q=${encodeURIComponent(q)}`
  );

  return autoCompleteResponse.body.pipe(res);
}

function getSoundcloudUser(req: ExpressRequest, res: ExpressResponse) {
  const {
    query: { username }
  } = req;

  const userProfileUrl = `https%3A//soundcloud.com/${username}`;
  const userProfileEndpoint = `${SC_API_V2_BASE}/resolve?url=${userProfileUrl}`;

  return fetchSoundcloudAndPipeResponse(userProfileEndpoint, res);
}

function getSoundcloudUserLikes(req: ExpressRequest, res: ExpressResponse) {
  const {
    params: { soundcloudUserId }
  } = req;
  const likesEndpoint = `${SC_API_V2_BASE}/users/${soundcloudUserId}/likes?&limit=30&offset=0&linked_partitioning=1`;

  return fetchSoundcloudAndPipeResponse(likesEndpoint, res);
}

async function getSoundcloudUserPlaylists(
  req: ExpressRequest,
  res: ExpressResponse
) {
  const {
    params: { soundcloudUserId }
  } = req;

  try {
    const playlistsEndpoint = `${SC_API_V2_BASE}/users/${soundcloudUserId}/playlists`;
    const playlistsResponse = await fetchSoundcloud(playlistsEndpoint);
    const playlistsCollection: SoundcloudGetUserPlaylistsResponse =
      await playlistsResponse.json();

    for (let playlist of playlistsCollection.collection) {
      set(
        playlist,
        "tracks",
        await getMissingSoundcloudTrackInfo(playlist.tracks)
      );
    }

    console.log(playlistsCollection);

    return res.status(200).send(playlistsCollection);
  } catch (e) {
    console.error(e);

    return res.status(500).end();
  }
}

/**
 * Sometimes soundcloud api returns only the first 5 tracks as full objects so we use this to fill in the rest of the infomation for the remaining tracks
 * @param tracks list of tracks that may be either SoundcloudTrack or SoundcloudTrackLite
 * @return a list of SoundcloudTracks that have replaced the lite version with the full versions
 */
async function getMissingSoundcloudTrackInfo(
  tracks: (SoundcloudTrack | SoundcloudTrackLite)[]
): Promise<SoundcloudTrack[]> {
  const tracksThatNeedInfo: SoundcloudTrackLite[] = tracks.filter(
    (track) => !("title" in track)
  );

  const soundcloudTrackInfoResponse = await getSoundcloudTrackInfo(
    tracksThatNeedInfo.map((track) => track.id)
  );

  const tracksWithInfo = await soundcloudTrackInfoResponse.json();
  const tracksByIdMap = keyBy(tracksWithInfo, "id");

  return tracks.map((track) => tracksByIdMap[track.id] || track);
}

async function getSoundcloudPlaylist(
  req: ExpressRequest,
  res: ExpressResponse
) {
  const {
    params: { soundcloudPlaylistId }
  } = req;
  const playlistEndpoint = `${SC_API_V2_BASE}/playlists/${soundcloudPlaylistId}?limit=`;

  try {
    const playlistResponse = await fetchSoundcloud(playlistEndpoint);
    const soundcloudPlaylist: SoundcloudPlaylist =
      await playlistResponse.json();

    set(
      soundcloudPlaylist,
      "tracks",
      await getMissingSoundcloudTrackInfo(soundcloudPlaylist.tracks)
    );

    return res.send(soundcloudPlaylist).status(200).end();
  } catch (e) {
    console.error(e);
    throw e;
  }
}

function getSoundcloudTrackInfo(ids: number[]) {
  const trackInfoEndpoint = `${SC_API_V2_BASE}/tracks?ids=${encodeURIComponent(
    ids.join(",")
  )}`;

  return fetchSoundcloud(trackInfoEndpoint);
}

function searchSoundcloudTracks(req: ExpressRequest, res: ExpressResponse) {
  const {
    query: { q }
  } = req;
  const trackSearchEndpoint = `${SC_API_V2_BASE}/search/tracks?q=${q}`;

  return fetchSoundcloudAndPipeResponse(trackSearchEndpoint, res);
}

function searchSoundcloudArtists(req: ExpressRequest, res: ExpressResponse) {
  const {
    query: { q }
  } = req;
  const userSearchEndpoint = `${SC_API_V2_BASE}/search/users?q=${q}`;

  return fetchSoundcloudAndPipeResponse(userSearchEndpoint, res);
}

function getSoundcloudArtist(req: ExpressRequest, res: ExpressResponse) {
  const {
    params: { soundcloudArtistId }
  } = req;

  const userEndpoint = `${SC_API_V2_BASE}/users/${soundcloudArtistId}`;

  return fetchSoundcloudAndPipeResponse(userEndpoint, res);
}

function getSoundcloudArtistTracks(req: ExpressRequest, res: ExpressResponse) {
  const {
    params: { soundcloudArtistId }
  } = req;

  const artistTracksEndpoint = `${SC_API_V2_BASE}/stream/users/${soundcloudArtistId}?limit=30&linked_partitioning=1`;

  return fetchSoundcloudAndPipeResponse(artistTracksEndpoint, res);
}

function getSoundcloudArtistTopTracks(
  req: ExpressRequest,
  res: ExpressResponse
) {
  const {
    params: { soundcloudArtistId }
  } = req;

  const artistSpotlightEndpoint = `${SC_API_V2_BASE}/users/${soundcloudArtistId}/toptracks?limit=30&linked_partitioning=1`;

  return fetchSoundcloudAndPipeResponse(artistSpotlightEndpoint, res);
}

function getRelatedSoundcloudTracks(req: ExpressRequest, res: ExpressResponse) {
  const {
    params: { soundcloudTrackId }
  } = req;

  const relatedTracksEndpoint = `${SC_API_V2_BASE}/stations/soundcloud:track-stations:${soundcloudTrackId}/tracks`;

  return fetchSoundcloudAndPipeResponse(relatedTracksEndpoint, res);
}

export = {
  getSoundcloudSearchResults,
  getSuggestedAutocomplete,
  getSoundcloudUser,
  getSoundcloudUserPlaylists,
  getSoundcloudPlaylist,
  searchSoundcloudTracks,
  searchSoundcloudArtists,
  getSoundcloudArtist,
  getSoundcloudUserLikes,
  getRelatedSoundcloudTracks,
  getSoundcloudArtistTracks,
  getSoundcloudArtistTopTracks
};
