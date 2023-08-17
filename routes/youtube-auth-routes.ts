import express = require("express");
import authMiddleware = require("../middleware/ensureAuthenticated");
import authController = require("../controllers/auth-controller");

const router = express.Router();

const YOUTUBE = "youtube";

// Client will get directed to this route when they click "Login with YouTube"
router.get(
  "/",
  authController.authenticateWithOauth(YOUTUBE),
  authController.authNoop,
);
router.get(
  "/callback",
  authController.handleOauthCallback(YOUTUBE),
  authController.loginUser(YOUTUBE),
);

// Can only link accounts when logged in
router.use("/link", authMiddleware.ensureAuthenticatedRoute);

const IS_LINKING = true;

// Client will get directed to this route when they click "Connect YouTube Account"
router.get(
  "/link",
  authController.authenticateWithOauth(YOUTUBE, IS_LINKING),
  authController.authNoop,
);
router.get(
  "/link/callback",
  authController.handleOauthCallback(YOUTUBE, IS_LINKING),
  authController.loginUser(YOUTUBE, IS_LINKING),
);

export = router;
