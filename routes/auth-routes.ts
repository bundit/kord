import express = require("express");
const router = express.Router();

import spotifyAuthRoutes = require("./spotify-auth-routes");
import youtubeAuthRoutes = require("./youtube-auth-routes");
import authMiddleware = require("../middleware/ensureAuthenticated");
import authController = require("../controllers/auth-controller");

router.use("/spotify", spotifyAuthRoutes);
router.use("/youtube", youtubeAuthRoutes);

router.get(
  "/token",
  authMiddleware.ensureAuthenticatedRequest,
  authController.refreshSessionToken,
);
router.get(
  "/:provider/refresh",
  authMiddleware.ensureAuthenticatedRequest,
  authController.refreshOauthToken,
);
router.get("/logout", authController.logoutUser);

export = router;
