const router = require("express").Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

router.get(
  "/",
  passport.authenticate("google", {
    scope: [
      "email",
      "profile",
      "openid",
      "https://www.googleapis.com/auth/youtube.readonly"
    ],
    showDialog: true,
    prompt: "consent",
    accessType: "offline"
  }),
  // eslint-disable-next-line
  (res, req) => {
    // The request will be redirected to spotify for authentication, so this
    // function will not be called.
  }
);

router.get(
  "/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // This code block will only execute if login is successful
    const { user } = req;

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
        maxAge: process.env.JWT_TOKEN_EXPIRE,
        secure: process.env.NODE_ENV === "production",
        overwrite: true
      });
      res.redirect(
        `/app/library#source=youtube&youtubeToken=${user.accessToken}`
      );
    });
  }
);

module.exports = router;
