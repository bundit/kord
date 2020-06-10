const passport = require("passport");
const refresh = require("passport-oauth2-refresh");
const SpotifyStrategy = require("passport-spotify").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const JWTStrategy = require("passport-jwt").Strategy;

const AuthService = require("../services/auth");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

const spotifyStrategy = new SpotifyStrategy(
  {
    clientID: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    callbackURL: process.env.SPOTIFY_CALLBACK
  },
  (accessToken, refreshToken, expiresIn, profile, done) => {
    AuthService.SignUpOrSignIn(profile, refreshToken, accessToken, done);
  }
);

const youtubeStrategy = new GoogleStrategy(
  {
    clientID: process.env.YOUTUBE_CLIENT_ID,
    clientSecret: process.env.YOUTUBE_CLIENT_SECRET,
    callbackURL: process.env.YOUTUBE_CALLBACK
  },
  (accessToken, refreshToken, profile, cb) => {
    AuthService.SignUpOrSignIn(profile, refreshToken, accessToken, cb);
  }
);

passport.use(spotifyStrategy);
refresh.use(spotifyStrategy);

passport.use(youtubeStrategy);
refresh.use(youtubeStrategy);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: req => req.cookies.kordUser,
      secretOrKey: process.env.JWT_SECRET
    },
    (jwtPayload, done) => {
      if (Date.now() > jwtPayload.expires) {
        return done("jwt expired", null);
      }

      return done(null, jwtPayload);
    }
  )
);
