const express = require("express");
const router = require("express").Router();
const path = require("path");

router.use(express.static(path.resolve(__dirname, "../", "landing", "public")));

router.get("/", (req, res) => {
  res.sendFile(
    path.resolve(__dirname, "../", "landing", "public", "index.html")
  );
});

module.exports = router;
