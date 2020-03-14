const router = require("express").Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

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
    // This code block will only execute if login is successful
    const { user } = req;

    // JWT payload
    const payload = {
      username: user.email,
      expires: Date.now() + parseInt(process.env.JWT_TOKEN_EXPIRE, 10)
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
        secure: process.env.NODE_ENV === "production"
      });

      res.redirect("/library");
    });
  }
);

module.exports = router;
