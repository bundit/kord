const router = require("express").Router();
const {
  ensureAuthenticatedRoute
} = require("../middleware/ensureAuthenticated");
const {
  authenticateWithOauth,
  authNoop,
  handleOauthCallback,
  loginUser
} = require("../controllers/auth-controller");

const SPOTIFY = "spotify";

// Client will get directed to this route when they click "Login with Spotify"
router.get("/", authenticateWithOauth(SPOTIFY), authNoop);
router.get("/callback", handleOauthCallback(SPOTIFY), loginUser(SPOTIFY));

// Can only link accounts when logged in
router.use("/link", ensureAuthenticatedRoute);

const IS_LINKING = true;

// Client will get directed to this route when they click "Connect Spotify Account"
router.get("/link", authenticateWithOauth(SPOTIFY, IS_LINKING), authNoop);
router.get(
  "/link/callback",
  handleOauthCallback(SPOTIFY, IS_LINKING),
  loginUser(SPOTIFY, IS_LINKING)
);

module.exports = router;
