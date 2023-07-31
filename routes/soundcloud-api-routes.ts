import express = require("express");

const router = express.Router();

import ApiController = require("../controllers/api-controller");

// @Deprecated
// Will be phasing this out for dedicated api routes
router.get("/", ApiController.getSoundcloudSearchResults);

router.get("/user", ApiController.getSoundcloudUser);

router.get(
  "/user/:soundcloudUserId/likes",
  ApiController.getSoundcloudUserLikes
);

router.get(
  "/user/:soundcloudUserId/playlist",
  ApiController.getSoundcloudUserPlaylists
);

router.get(
  "/playlist/:soundcloudPlaylistId",
  ApiController.getSoundcloudPlaylist
);

router.get(
  "/track/:soundcloudTrackId/related",
  ApiController.getRelatedSoundcloudTracks
);

router.get("/search/tracks", ApiController.searchSoundcloudTracks);

router.get("/search/artists", ApiController.searchSoundcloudArtists);

router.get("/artist/:soundcloudArtistId", ApiController.getSoundcloudArtist);

router.get(
  "/artist/:soundcloudArtistId/tracks",
  ApiController.getSoundcloudArtistTracks
);

router.get(
  "/artist/:soundcloudArtistId/toptracks",
  ApiController.getSoundcloudArtistTopTracks
);

export = router;
