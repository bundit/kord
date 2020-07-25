const router = require("express").Router();
const passport = require("passport");
const request = require("request");
const KeyService = require("../services/keys");

router.get("/", (req, res, next) => {
  passport.authenticate("jwt", (err, user, info) => {
    if (err) {
      return res.status(403).json({ message: info });
    }

    if (!user) {
      return res.status(401).json({ message: info });
    }

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
  })(req, res, next);
});

module.exports = router;
