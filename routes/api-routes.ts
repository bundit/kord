import express = require("express");
import ApiController = require("../controllers/api-controller");
import soundcloudApiRoutes = require("../routes/soundcloud-api-routes");

const router = express.Router();
const {
  ensureAuthenticatedRequest,
} = require("../middleware/ensureAuthenticated");

// Authenticate all requests to /api
router.use(ensureAuthenticatedRequest);

router.use("/soundcloud", soundcloudApiRoutes);

router.get("/autocomplete", ApiController.getSuggestedAutocomplete);

export = router;
