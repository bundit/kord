const passport = require("passport");
const SpotifyStrategy = require("passport-spotify").Strategy;
const JWTStrategy = require("passport-jwt").Strategy;

const db = require("./database-setup");

passport.serializeUser((user, done) => {
  done(null, user.id);
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

async function insertUserProfile(client, user, provider) {
  const { kordUserID, providerID, accessToken, refreshToken, images } = user;

  const profileInsertQuery = {
    text: `INSERT INTO user_profiles(user_id, oauth_provider, provider_id, access_token, refresh_token, images)
             VALUES (
               $1, $2, $3, $4, $5, $6
             )
           ON CONFLICT DO NOTHING;`,
    values: [
      kordUserID,
      provider,
      providerID,
      accessToken,
      refreshToken,
      images
    ]
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

        const newUserProfile = {
          accessToken,
          refreshToken,
          kordUserID: kordUser.id,
          providerID: spotifyUserID,
          images
        };

        await insertUserProfile(client, newUserProfile, "spotify");

        // Return the user profile to be serialized
        done(null, kordUser);
      });
    }
  )
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: req => req.cookies.kordUser,
      secretOrKey: process.env.JWT_SECRET,
      httpOnly: true,
      secure: true
    },
    (jwtPayload, done) => {
      if (Date.now() > jwtPayload.expires) {
        return done("jwt expired", null);
      }

      return done(null, jwtPayload);
    }
  )
);
