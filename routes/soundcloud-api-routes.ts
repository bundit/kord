import express = require("express");

const router = express.Router();

import ApiController = require("../controllers/api-controller");

// @Deprecated
// Will be phasing this out for dedicated api routes
router.get("/", ApiController.getSoundcloudSearchResults);

router.get("/user", ApiController.getSoundcloudUser);

export = router;
