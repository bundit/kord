import path = require("path");
import express = require("express");

const router = express.Router();

router.use(express.static(path.resolve(__dirname, "../", "landing", "public")));

router.get("/", (_req, res) => {
  res.sendFile(
    path.resolve(__dirname, "../", "landing", "public", "index.html"),
  );
});

export = router;
