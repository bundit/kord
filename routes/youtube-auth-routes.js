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

const YOUTUBE = "youtube";

// Client will get directed to this route when they click "Login with YouTube"
router.get("/", authenticateWithOauth(YOUTUBE), authNoop);
router.get("/callback", handleOauthCallback(YOUTUBE), loginUser(YOUTUBE));

// Can only link accounts when logged in
router.use("/link", ensureAuthenticatedRoute);

const IS_LINKING = true;

// Client will get directed to this route when they click "Connect YouTube Account"
router.get("/link", authenticateWithOauth(YOUTUBE, IS_LINKING), authNoop);
router.get(
  "/link/callback",
  handleOauthCallback(YOUTUBE, IS_LINKING),
  loginUser(YOUTUBE, IS_LINKING)
);

module.exports = router;
