const router = require("express").Router();

const spotifyAuthRoutes = require("./spotify-auth-routes");
const youtubeAuthRoutes = require("./youtube-auth-routes");
const {
  ensureAuthenticatedRequest
} = require("../middleware/ensureAuthenticated");
const {
  refreshSessionToken,
  refreshOauthToken,
  logoutUser
} = require("../controllers/auth-controller");

router.use("/spotify", spotifyAuthRoutes);
router.use("/youtube", youtubeAuthRoutes);

router.get("/token", ensureAuthenticatedRequest, refreshSessionToken);
router.get("/:provider/refresh", ensureAuthenticatedRequest, refreshOauthToken);
router.get("/logout", logoutUser);

module.exports = router;
