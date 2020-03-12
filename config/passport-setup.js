const passport = require("passport");
const SpotifyStrategy = require("passport-spotify").Strategy;

const db = require("./database-setup");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (userID, done) => {
  const query = {
    text: `SELECT *
            FROM users
            WHERE id=$1;`,
    values: [userID]
  };
  const {
    rows: [user]
  } = await db.query(query);

  done(null, user);
});

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

async function insertNewUser(client, email) {
  const userInsertQuery = {
    text: `INSERT INTO users(email, created_at)
           VALUES
           (
              $1,
              now()
           )
           RETURNING *;`,
    values: [email]
  };
  const { rows: newUserRows } = await client.query(userInsertQuery);

  return newUserRows[0];
}

async function insertUserProfile(client, userID, providerUserID, images) {
  const profileInsertQuery = {
    text: `INSERT INTO user_profiles(user_id, oauth_provider, provider_id, photos)
             VALUES
             (
               $1,
               'spotify',
               $2,
               $3
             )
           ON CONFLICT DO NOTHING;`,
    values: [userID, providerUserID, images]
  };

  await client.query(profileInsertQuery);
}

passport.use(
  new SpotifyStrategy(
    {
      clientID: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      callbackURL: "http://localhost:8888/auth/spotify/callback"
    },
    (accessToken, refreshToken, expiresIn, profile, done) => {
      db.getClient(async client => {
        const {
          id: spotifyUserID,
          _json: { email, images }
        } = profile;

        let kordUser = await checkIfUserExists(client, email);

        if (!kordUser) {
          kordUser = await insertNewUser(client, email);
        }

        await insertUserProfile(client, kordUser.id, spotifyUserID, images);

        // Return the user profile to be serialized
        done(null, kordUser);
      });
    }
  )
);
