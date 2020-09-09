const router = require("express").Router();
const passport = require("passport");
const jwtDecode = require("jwt-decode");
const db = require("../config/database-setup");

router.use((req, res, next) => {
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

router.get("/playlists", async (req, res) => {
  const kordUser = jwtDecode(req.cookies.kordUser);
  const exclude = req.query.exclude || "none";

  const query = {
    text: `SELECT source, external_id, title, "isConnected", index, img, total
           FROM
             (users JOIN user_playlists
             ON users.id=user_playlists.user_id)
           WHERE users.id=$1 AND user_playlists.source!=$2
           ORDER BY source, index;`,
    values: [kordUser.id, exclude]
  };

  const result = await db.query(query);
  res.json(result.rows);
});

router.put("/playlists", (req, res) => {
  const kordUser = jwtDecode(req.cookies.kordUser);
  const { source, playlists } = req.body;

  return db
    .transaction(async client => {
      const deleteQuery = {
        text: `DELETE FROM user_playlists
               WHERE user_id=$1 AND source=$2;`,
        values: [kordUser.id, source]
      };

      await client.query(deleteQuery);

      let numValue = 1;
      const stringValues = [];
      const values = [];

      playlists.forEach(playlist => {
        stringValues.push(
          // eslint-disable-next-line
          `($${numValue++}, $${numValue++}, $${numValue++}, $${numValue++}, $${numValue++}, $${numValue++}, $${numValue++}, $${numValue++})`
        );
        values.push(
          kordUser.id,
          source,
          playlist.id,
          playlist.title,
          playlist.isConnected,
          playlist.index,
          JSON.stringify(playlist.img),
          playlist.total
        );
      });

      const insertQuery = {
        text: `INSERT INTO user_playlists(user_id, source, external_id, title, "isConnected", index, img, total)
               VALUES ${stringValues};`,
        values
      };

      await client.query(insertQuery);
    })
    .then(() => res.status(200).send("OK"))
    .catch(e => res.status(400).json(e));
});

module.exports = router;
