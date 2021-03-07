const jwtDecode = require("jwt-decode");
const db = require("../config/database-setup");

async function getUserProfiles(req, res) {
  const kordUser = jwtDecode(req.cookies.kordUser);
  const exclude = req.query.exclude || "none";

  const query = {
    text: `SELECT oauth_provider as source, provider_id as id, images as image, profile_url as "profileUrl", username
           FROM user_profiles
           WHERE user_id=$1 AND oauth_provider!=$2`,
    values: [kordUser.id, exclude]
  };

  try {
    const result = await db.query(query);
    return res.json(result.rows);
  } catch (e) {
    return res.status(400).json(e);
  }
}

async function insertUserProfile(req, res) {
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
      profile.img,
      profile.username,
      profile.profile_url
    ]
  };

  try {
    await db.query(query);
  } catch (e) {
    return res.status(400).json(e);
  }

  return res.status(204).send();
}

async function deleteUserProfile(req, res) {
  const kordUser = jwtDecode(req.cookies.kordUser);
  const { provider } = req.query;

  if (!provider) {
    return res.status(400).send("Missing parameter provider");
  }

  try {
    await db.transaction(async client => {
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
    });
  } catch (e) {
    return res.status(400).json(e);
  }

  return res.status(204).send();
}

async function getUserPlaylists(req, res) {
  const kordUser = jwtDecode(req.cookies.kordUser);
  const exclude = req.query.exclude || "none";

  const query = {
    text: `SELECT source, external_id, title, is_connected as "isConnected", index, img, total, is_starred as "isStarred"
           FROM
             (users JOIN user_playlists
             ON users.id=user_playlists.user_id)
           WHERE users.id=$1 AND user_playlists.source!=$2
           ORDER BY source, index;`,
    values: [kordUser.id, exclude]
  };

  try {
    const result = await db.query(query);
    return res.json(result.rows);
  } catch (e) {
    return res.status(400).json(e);
  }
}

async function insertUserPlaylists(req, res) {
  const kordUser = jwtDecode(req.cookies.kordUser);
  const { source, playlists } = req.body;

  try {
    await db.transaction(async client => {
      if (source) {
        const deleteQuery = {
          text: `DELETE FROM user_playlists
                  WHERE user_id=$1 AND source=$2;`,
          values: [kordUser.id, source]
        };

        await client.query(deleteQuery);
      }

      playlists.forEach(
        async ({ id, title, isConnected, index, img, total, isStarred }) => {
          const insertQuery = {
            text: `INSERT INTO user_playlists(user_id, source, external_id, title, is_connected, index, img, total, is_starred)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);`,
            values: [
              kordUser.id,
              source,
              id,
              title,
              isConnected,
              index,
              JSON.stringify(img),
              total,
              isStarred
            ]
          };

          await client.query(insertQuery);
        }
      );
    });
  } catch (e) {
    return res.status(400).json(e);
  }

  return res.status(204).send();
}

async function updateUserPlaylists(req, res) {
  const kordUser = jwtDecode(req.cookies.kordUser);
  const operations = req.body;

  try {
    await db.getClient(client => {
      operations.forEach(async ({ field, playlistId, value }) => {
        const patchQuery = {
          text: `UPDATE user_playlists
                   SET ${field}=$3
                   WHERE user_id=$1 AND external_id=$2`,
          values: [kordUser.id, playlistId, value]
        };

        try {
          await client.query(patchQuery);
        } catch (e) {
          await client.query(patchQuery);
        }
      });
    });
  } catch (e) {
    return res.status(400).json(e);
  }

  return res.status(204).send();
}

module.exports = {
  getUserProfiles,
  insertUserProfile,
  deleteUserProfile,
  getUserPlaylists,
  insertUserPlaylists,
  updateUserPlaylists
};
