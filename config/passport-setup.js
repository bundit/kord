const passport = require("passport");
const SpotifyStrategy = require("passport-spotify").Strategy;
const JWTStrategy = require("passport-jwt").Strategy;

const AuthService = require("../services/auth");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.use(
  new SpotifyStrategy(
    {
      clientID: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      callbackURL: process.env.SPOTIFY_CALLBACK
    },
    (accessToken, refreshToken, expiresIn, profile, done) => {
      AuthService.SignUpOrSignIn(profile, refreshToken, accessToken, done);
    }
  )
);

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
