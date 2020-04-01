const router = require("express").Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

// Client will get directed to this route when they click "Login with Spotify"
router.get(
  "/",
  passport.authenticate("spotify", {
    scope: [
      "user-read-email",
      "user-read-private",
      "user-read-playback-state",
      "streaming",
      "user-modify-playback-state",
      "playlist-modify-public",
      "user-library-modify",
      "user-top-read",
      "playlist-read-collaborative",
      "user-read-currently-playing",
      // "playlist-read-private",
      "user-follow-read",
      "user-read-recently-played",
      "playlist-modify-private",
      "user-library-read"
    ],
    showDialog: true
  }),
  // eslint-disable-next-line
  (req, res) => {
    // The request will be redirected to spotify for authentication, so this
    // function will not be called.
  }
);

// Client will get redirected to this route by the Spotify oauth server
router.get(
  "/callback",
  passport.authenticate("spotify", { failureRedirect: "/login" }),
  (req, res) => {
    // This code block will only execute if login is successful
    const { user } = req;

    // TODO get SSL Certs
    // const isProduction = process.env.NODE_ENV === "production";
    const expires = Date.now() + parseInt(process.env.JWT_TOKEN_EXPIRE, 10);

    // JWT payload
    const payload = {
      email: user.email,
      expires
    };

    /** assigns payload to req.user */
    req.login(payload, { session: false }, error => {
      if (error) {
        res.status(400).send({ error });
      }

      /** generate a signed json web token and return it in the response */
      const token = jwt.sign(JSON.stringify(payload), process.env.JWT_SECRET);

      /** assign our jwt to the cookie */
      res.cookie("kordUser", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7
        // TODO Get SSL Certs
        // secure: isProduction
      });
      res.redirect(
        `/app/library#source=spotify&spotifyToken=${user.accessToken}`
      );
    });
  }
);

module.exports = router;
