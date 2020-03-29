const router = require("express").Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

const spotifyAuthRoutes = require("./spotify-auth-routes");
// const mixcloudAuthRoutes = require("./mixcloud-auth-routes");

router.use("/spotify", spotifyAuthRoutes);
// router.use("/mixcloud", mixcloudAuthRoutes);

router.get("/token", (req, res, next) => {
  passport.authenticate("jwt", (err, user, info) => {
    const expires = Date.now() + parseInt(process.env.JWT_TOKEN_EXPIRE, 10);

    if (err) {
      return res.send(err);
    }

    if (!user) {
      return res.send(`user is not logged in & info = ${info}`);
    }

    const newToken = jwt.sign(
      {
        email: user.email,
        expires
      },
      process.env.JWT_SECRET
    );

    res.cookie("kordUser", newToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7
      // maxAge: expires
      // secure: process.env.NODE_ENV === "production"
    });

    return res.send("OK");
  })(req, res, next);
});

module.exports = router;
