const router = require("express").Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const {
  ensureAuthenticatedRoute
} = require("../middleware/ensureAuthenticated");

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
      "playlist-read-private",
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

    // const isProduction = process.env.NODE_ENV === "production";
    const expires = Date.now() + parseInt(process.env.JWT_TOKEN_EXPIRE, 10);

    // JWT payload
    const payload = {
      id: user.id,
      email: user.email,
      expires
    };

    /** assigns payload to req.user */
    req.login(payload, { session: false }, error => {
      if (error) {
        res.status(400).send({ error: error.toString() });
      }

      /** generate a signed json web token and return it in the response */
      const token = jwt.sign(JSON.stringify(payload), process.env.JWT_SECRET);

      /** assign our jwt to the cookie */
      res.cookie("kordUser", token, {
        httpOnly: true,
        maxAge: process.env.JWT_TOKEN_EXPIRE,
        secure: process.env.NODE_ENV === "production",
        overwrite: true
      });
      res.redirect(
        `/app/library#source=spotify&accessToken=${user.accessToken}&userId=${user.id}&login=true`
      );
    });
  }
);

// Can only link accounts when logged in
router.use("/link", ensureAuthenticatedRoute);

router.get(
  "/link",
  passport.authenticate("spotifyLink", {
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
      "playlist-read-private",
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

router.get(
  "/link/callback",
  passport.authenticate("spotifyLink", { failureRedirect: "/login" }),
  (req, res) => {
    const { user } = req;

    const expires = Date.now() + parseInt(process.env.JWT_TOKEN_EXPIRE, 10);

    // JWT payload
    const payload = {
      id: user.id,
      email: user.email,
      expires
    };

    /** assigns payload to req.user */
    req.login(payload, { session: false }, error => {
      if (error) {
        res.status(400).send({ error: error.toString() });
      }

      res.redirect(
        `/app/library#source=spotify&accessToken=${user.accessToken}&userId=${user.id}`
      );
    });
  }
);

module.exports = router;
