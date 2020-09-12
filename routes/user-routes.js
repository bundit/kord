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

router.get("/profiles", async (req, res) => {
  const kordUser = jwtDecode(req.cookies.kordUser);
  const exclude = req.query.exclude || "none";

  const query = {
    text: `SELECT oauth_provider as source, provider_id as id, images, profile_url as "profileUrl", username
           FROM user_profiles
           WHERE user_id=$1 AND oauth_provider!=$2`,
    values: [kordUser.id, exclude]
  };

  const result = await db.query(query);

  return res.json(result.rows);
});

router.put("/profiles", async (req, res) => {
  const kordUser = jwtDecode(req.cookies.kordUser);
  const { source, profile } = req.body;

  const query = {
    text: `INSERT INTO user_profiles(user_id, oauth_provider, provider_id, images, username, profile_url)
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT (user_id, oauth_provider) DO UPDATE
             SET provider_id=$3, images=$4, username=$5;`,
    values: [
      kordUser.id,
      source,
      profile.id,
      JSON.stringify(profile.img),
      profile.username,
      profile.profile_url
    ]
  };

  try {
    await db.query(query);
    return res.status(200).send("OK");
  } catch (e) {
    return res.status(400).json(e);
  }
});

router.delete("/profiles", async (req, res) => {
  const kordUser = jwtDecode(req.cookies.kordUser);
  const { provider } = req.query;

  if (!provider) {
    return res.status(400).send("Missing parameter provider");
  }

  return db
    .transaction(async client => {
      const deleteProfileQuery = {
        text: `DELETE FROM user_profiles
             WHERE user_id=$1 AND oauth_provider=$2`,
        values: [kordUser.id, provider]
      };

      await client.query(deleteProfileQuery);

      const deletePlaylistsQuery = {
        text: `DELETE FROM user_playlists
             WHERE user_id=$1 AND source=$2`,
        values: [kordUser.id, provider]
      };

      await client.query(deletePlaylistsQuery);
    })
    .then(() => res.status(200).send("OK"))
    .catch(e => res.status(500).json(e));
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
  return res.json(result.rows);
});

router.put("/playlists", (req, res) => {
  const kordUser = jwtDecode(req.cookies.kordUser);
  const { source, playlists } = req.body;

  return db
    .transaction(async client => {
      if (source) {
        const deleteQuery = {
          text: `DELETE FROM user_playlists
                 WHERE user_id=$1 AND source=$2;`,
          values: [kordUser.id, source]
        };

        await client.query(deleteQuery);
      }

      playlists.forEach(
        async ({ id, title, isConnected, index, img, total }) => {
          const insertQuery = {
            text: `INSERT INTO user_playlists(user_id, source, external_id, title, "isConnected", index, img, total)
                   VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`,
            values: [
              kordUser.id,
              source,
              id,
              title,
              isConnected,
              index,
              JSON.stringify(img),
              total
            ]
          };

          await client.query(insertQuery);
        }
      );
    })
    .then(() => res.status(200).send("OK"))
    .catch(e => res.status(400).json(e));
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

module.exports = router;
