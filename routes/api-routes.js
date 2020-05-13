const router = require("express").Router();
const passport = require("passport");
const request = require("request");

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

    return request(url).pipe(res);
  })(req, res, next);
});

module.exports = router;
