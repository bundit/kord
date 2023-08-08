import express = require("express");
import authMiddleware = require("../middleware/ensureAuthenticated");
import authController = require("../controllers/auth-controller");

const router = express.Router();

const SPOTIFY = "spotify";

// Client will get directed to this route when they click "Login with Spotify"
router.get(
  "/",
  authController.authenticateWithOauth(SPOTIFY),
  authController.authNoop,
);

router.get(
  "/callback",
  authController.handleOauthCallback(SPOTIFY),
  authController.loginUser(SPOTIFY),
);

// Can only link accounts when logged in
router.use("/link", authMiddleware.ensureAuthenticatedRoute);

const IS_LINKING = true;

// Client will get directed to this route when they click "Connect Spotify Account"
router.get(
  "/link",
  authController.authenticateWithOauth(SPOTIFY, IS_LINKING),
  authController.authNoop,
);
router.get(
  "/link/callback",
  authController.handleOauthCallback(SPOTIFY, IS_LINKING),
  authController.loginUser(SPOTIFY, IS_LINKING),
);

export = router;
