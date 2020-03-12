const router = require("express").Router();
const passport = require("passport");

const spotifyAuthRoutes = require("./spotify-auth-routes");
// const mixcloudAuthRoutes = require("./mixcloud-auth-routes");

router.use(passport.initialize());

router.use("/spotify", spotifyAuthRoutes);
// router.use("/mixcloud", mixcloudAuthRoutes);

module.exports = router;
