const router = require("express").Router();

const {
  ensureAuthenticatedRequest
} = require("../middleware/ensureAuthenticated");
const {
  getSoundcloudSearchResults,
  getSuggestedAutocomplete
} = require("../controllers/api-controller");

// Authenticate all requests to /api
router.use(ensureAuthenticatedRequest);

router.get("/soundcloud", getSoundcloudSearchResults);

router.get("/autocomplete", getSuggestedAutocomplete);

module.exports = router;
