const router = require("express").Router();
const request = require("request");
const KeyService = require("../services/keys");
const {
  ensureAuthenticatedRequest
} = require("../middleware/ensureAuthenticated");

// Authenticate all requests to /user
router.use(ensureAuthenticatedRequest);

router.get("/", (req, res) => {
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
});

module.exports = router;
