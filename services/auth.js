const jwtDecode = require("jwt-decode");
const db = require("../config/database-setup");

// Returns false if does not exist, otherwise returns user row
async function checkIfUserExists(client, email) {
  const searchQuery = {
    text: `SELECT *
             FROM users
             WHERE email=$1`,
    values: [email]
  };

  const { rows: userSearchRows } = await client.query(searchQuery);

  return userSearchRows.length && userSearchRows[0];
}

async function getUserById(client, kordId) {
  const searchQuery = {
    text: `SELECT *
             FROM users
             WHERE id=$1`,
    values: [kordId]
  };

  const {
    rows: [userRow]
  } = await client.query(searchQuery);

  return userRow;
}

// Insert a user and return the new row
async function insertNewUser(client, email) {
  const userInsertQuery = {
    text: `INSERT INTO users(id, email, created_at)
           VALUES
           (
              uuid_generate_v4(),
              $1,
              now()
           )
           RETURNING *;`,
    values: [email]
  };
  const { rows: newUserRows } = await client.query(userInsertQuery);

  return newUserRows[0];
}

// Insert a new external user login profile
async function insertUserProfile(client, user, provider) {
  const { kordUserID, providerID, refreshToken } = user;

  const profileInsertQuery = {
    text: `INSERT INTO user_profiles(user_id, oauth_provider, provider_id, refresh_token)
             VALUES (
               $1, $2, $3, $4
             )
           ON CONFLICT (user_id, oauth_provider) DO UPDATE
             SET refresh_token=$4`,
    values: [kordUserID, provider, providerID, refreshToken]
  };

  await client.query(profileInsertQuery);
}

module.exports = {
  SignUpOrSignIn(profile, refreshToken, accessToken, done) {
    db.getClient(async client => {
      const {
        id: providerID,
        _json: { email, images },
        provider
      } = profile;

      let kordUser = await checkIfUserExists(client, email);

      if (!kordUser) {
        kordUser = await insertNewUser(client, email);
      }

      const newUserProfile = {
        kordUserID: kordUser.id,
        refreshToken,
        providerID,
        images
      };

      await insertUserProfile(client, newUserProfile, provider);

      done(null, { ...kordUser, accessToken });
    });
  },
  LinkAccount(req, profile, refreshToken, accessToken, done) {
    db.getClient(async client => {
      const {
        id: providerID,
        _json: { images },
        provider
      } = profile;

      const kordUser = jwtDecode(req.cookies.kordUser);

      const newUserProfile = {
        kordUserID: kordUser.id,
        refreshToken,
        providerID,
        images
      };

      await insertUserProfile(client, newUserProfile, provider);

      done(null, { ...kordUser, accessToken });
    });
  }
};
