const router = require("express").Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

const spotifyAuthRoutes = require("./spotify-auth-routes");
// const mixcloudAuthRoutes = require("./mixcloud-auth-routes");

router.use(passport.initialize());

router.use("/spotify", spotifyAuthRoutes);
// router.use("/mixcloud", mixcloudAuthRoutes);

router.get("/token", (req, res, next) => {
  passport.authenticate("jwt", (err, user, info) => {
    if (err) {
      req.logout();
      return res.send(err);
    }

    if (!user) {
      req.logout();
      return res.send("user is not logged in");
    }

    const newToken = jwt.sign(
      {
        username: user.email,
        expires: Date.now() + parseInt(process.env.JWT_TOKEN_EXPIRE, 10)
      },
      process.env.JWT_SECRET
    );

    res.cookie("kordUser", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production"
    });

    return res.send("OK");
  })(req, res, next);
});

module.exports = router;
