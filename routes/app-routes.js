const router = require("express").Router();
const express = require("express");
const passport = require("passport");
const path = require("path");

router.use("/", (req, res, next) => {
  passport.authenticate("jwt", (err, user, info) => {
    if (err) {
      return res.redirect(`/login#err=${err}`);
    }

    if (!user) {
      return res.redirect(`/login#err=nouser&other=${info}`);
    }

    // No error, continue to next
    return next();
  })(req, res, next);
});

router.use(
  "/",
  express.static(path.resolve(__dirname, "../", "client", "build"))
);

router.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../", "client", "build", "index.html"));
});

module.exports = router;
