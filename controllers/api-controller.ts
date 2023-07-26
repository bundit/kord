import {
  Request as ExpressRequest,
  Response as ExpressResponse
} from "express";
import request, {
  Request as RequestRequest,
  Response as RequestResponse
} from "request";
const KeyService = require("../services/keys");

const SC_API_V2_BASE = "https://api-v2.soundcloud.com";

/**
 * Makes the request to soundcloud endpoint and handles adding the client_id and retry if expired
 * @param url the soundcloud endpoint
 * @returns
 */
function fetchSoundcloud(
  endpoint: string,
  res: ExpressResponse
): RequestRequest {
  function appendSoundcloudClientId(key: string): string {
    const concatChar = endpoint.includes("?") ? "&" : "?";

    return `${endpoint}${concatChar}client_id=${key}`;
  }

  return request
    .get(appendSoundcloudClientId(KeyService.soundcloudClientId))
    .on("response", async (response: RequestResponse) => {
      const { statusCode } = response;

      if (statusCode === 403 || statusCode === 401) {
        const newClientId = await KeyService.refreshSoundcloudClientId();

        // Failed to refresh soundcloud key
        if (typeof KeyService.soundcloudClientId !== "string") {
          return res.status(500).end();
        }

        return request
          .get(
            `${appendSoundcloudClientId(newClientId)}&client_id=${
              KeyService.soundcloudClientId
            }`
          )
          .pipe(res);
      }

      return response.pipe(res);
    });
}

function getSoundcloudSearchResults(req: ExpressRequest, res: ExpressResponse) {
  const {
    query: { url }
  } = req;

  if (typeof url !== "string" || !url) {
    return res.status(500);
  }

  return fetchSoundcloud(decodeURIComponent(url), res);
}

function getSuggestedAutocomplete(req: ExpressRequest, res: ExpressResponse) {
  const {
    query: { q }
  } = req;
  const endpoint =
    "http://suggestqueries.google.com/complete/search?client=chrome&ds=yt";

  if (typeof q !== "string" || !q) {
    return res.status(500);
  }

  return request
    .get(`${endpoint}&q=${encodeURIComponent(q)}`)
    .on("response", (response: RequestResponse) => response.pipe(res));
}

function getSoundcloudUser(req: ExpressRequest, res: ExpressResponse) {
  console.log("HEre");
  const {
    query: { username }
  } = req;

  const userProfileUrl = `https%3A//soundcloud.com/${username}`;
  const endpoint = `${SC_API_V2_BASE}/resolve?url=${userProfileUrl}&client_id=${KeyService.soundcloudClientId}`;

  return fetchSoundcloud(endpoint, res);
}

export = {
  getSoundcloudSearchResults,
  getSuggestedAutocomplete,
  getSoundcloudUser
};
