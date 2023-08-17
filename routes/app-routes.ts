import path = require("path");
import express = require("express");
import authMiddleware = require("../middleware/ensureAuthenticated");

const router = express.Router();

// Authenticate user before app routes
router.use("/", authMiddleware.ensureAuthenticatedRoute);

// Apply static files middleware
router.use(
  "/",
  express.static(path.resolve(__dirname, "../", "client", "build")),
);

// Send the React App
router.get("*", (_req, res) => {
  res.sendFile(path.resolve(__dirname, "../", "client", "build", "index.html"));
});

export = router;
