const router = require("express").Router();
const passport = require("passport");
const request = require("request");

// Client will get directed to this route when they click "Login with Spotify"
router.get(
  "/",
  passport.authenticate("spotify", {
    scope: ["user-read-email", "user-read-private"],
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
    const code = req.query.code || null;

    const authOptions = {
      url: "https://accounts.spotify.com/api/token",
      form: {
        // eslint-disable-next-line
        code: code,
        redirect_uri: "/", // redirectUri,
        grant_type: "authorization_code"
      },
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString("base64")}`
      },
      json: true
    };

    request.post(authOptions, (error, response, body) => {
      const { access_token: accessToken, refresh_token: refreshToken } = body;

      const uri = process.env.FRONTEND_URI || "http://localhost:3000/library";

      // Return access token and refresh token to client
      res.redirect(
        `${uri}?access_token=${accessToken}&source=spotify&refresh_token=${refreshToken}`
      );
    });
  }
);

module.exports = router;
