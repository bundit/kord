import express = require("express");
import authMiddleware = require("../middleware/ensureAuthenticated");
import userController = require("../controllers/user-controller");
const router = express.Router();

// Authenticate all requests to /user
router.use(authMiddleware.ensureAuthenticatedRequest);

router
  .route("/profiles")
  .get(userController.getUserProfiles)
  .put(userController.insertUserProfile)
  .delete(userController.deleteUserProfile);

router
  .route("/playlists")
  .get(userController.getUserPlaylists)
  .put(userController.insertUserPlaylists);

export = router;
