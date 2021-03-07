const request = require("request");
const KeyService = require("../services/keys");

function getSoundcloudSearchResults(req, res) {
  const {
    query: { url }
  } = req;

  return request
    .get(`${url}&client_id=${KeyService.soundcloudClientId}`)
    .on("response", async response => {
      const { statusCode } = response;

      if (statusCode === 403 || statusCode === 401) {
        await KeyService.refreshSoundcloudClientId();

        return request
          .get(`${url}&client_id=${KeyService.soundcloudClientId}`)
          .pipe(res);
      }

      return response.pipe(res);
    });
}

function getSuggestedAutocomplete(req, res) {
  const {
    query: { q }
  } = req;
  const endpoint =
    "http://suggestqueries.google.com/complete/search?client=chrome&ds=yt";

  return request
    .get(`${endpoint}&q=${encodeURIComponent(q)}`)
    .on("response", response => response.pipe(res));
}

module.exports = {
  getSoundcloudSearchResults,
  getSuggestedAutocomplete
};
