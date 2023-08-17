import express = require("express");

import authMiddleware = require("../middleware/ensureAuthenticated");
import authController = require("../controllers/auth-controller");
import spotifyAuthRoutes = require("./spotify-auth-routes");
import youtubeAuthRoutes = require("./youtube-auth-routes");

const router = express.Router();

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
