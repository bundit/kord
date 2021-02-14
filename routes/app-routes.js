const router = require("express").Router();
const express = require("express");
// const passport = require("passport");
const path = require("path");
const {
  ensureAuthenticatedRoute
} = require("../middleware/ensureAuthenticated");

// Authenticate user before app routes
router.use("/", ensureAuthenticatedRoute);

// Apply static files middleware
router.use(
  "/",
  express.static(path.resolve(__dirname, "../", "client", "build"))
);

// Send the React App
router.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../", "client", "build", "index.html"));
});

module.exports = router;
