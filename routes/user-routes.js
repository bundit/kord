const router = require("express").Router();
const passport = require("passport");
const jwtDecode = require("jwt-decode");
const db = require("../config/database-setup");

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

router.get("/playlists", async (req, res) => {
  const kordUser = jwtDecode(req.cookies.kordUser);

  const query = {
    text: `SELECT source, external_id, title, created_at
           FROM
             (users JOIN user_playlists
             ON users.id=user_playlists.user_id)
             WHERE users.id in (SELECT id FROM users WHERE users.email=$1);`,
    values: [kordUser.email]
  };

  const result = await db.query(query);
  res.json(result.rows);
});

module.exports = router;
