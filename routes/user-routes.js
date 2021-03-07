const router = require("express").Router();
const {
  ensureAuthenticatedRequest
} = require("../middleware/ensureAuthenticated");
const {
  getUserProfiles,
  insertUserProfile,
  deleteUserProfile,
  getUserPlaylists,
  insertUserPlaylists,
  updateUserPlaylists
} = require("../controllers/user-controller");

// Authenticate all requests to /user
router.use(ensureAuthenticatedRequest);

router
  .route("/profiles")
  .get(getUserProfiles)
  .put(insertUserProfile)
  .delete(deleteUserProfile);

router
  .route("/playlists")
  .get(getUserPlaylists)
  .put(insertUserPlaylists)
  .patch(updateUserPlaylists);

module.exports = router;
