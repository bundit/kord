const passport = require("passport");
const refresh = require("passport-oauth2-refresh");
const SpotifyStrategy = require("passport-spotify").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const JWTStrategy = require("passport-jwt").Strategy;

const AuthService = require("../services/auth");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

const spotifyAuth = new SpotifyStrategy(
  {
    clientID: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    callbackURL: process.env.SPOTIFY_CALLBACK
  },
  (accessToken, refreshToken, expiresIn, profile, done) => {
    AuthService.SignUpOrSignIn(profile, refreshToken, accessToken, done);
  }
);

const spotifyLink = new SpotifyStrategy(
  {
    clientID: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    callbackURL: process.env.SPOTIFY_LINK_CALLBACK,
    passReqToCallback: true
  },
  (req, accessToken, refreshToken, expiresIn, profile, done) => {
    AuthService.LinkAccount(req, profile, refreshToken, accessToken, done);
  }
);

const youtubeAuth = new GoogleStrategy(
  {
    clientID: process.env.YOUTUBE_CLIENT_ID,
    clientSecret: process.env.YOUTUBE_CLIENT_SECRET,
    callbackURL: process.env.YOUTUBE_CALLBACK
  },
  (accessToken, refreshToken, profile, cb) => {
    AuthService.SignUpOrSignIn(profile, refreshToken, accessToken, cb);
  }
);

const youtubeLink = new GoogleStrategy(
  {
    clientID: process.env.YOUTUBE_CLIENT_ID,
    clientSecret: process.env.YOUTUBE_CLIENT_SECRET,
    callbackURL: process.env.YOUTUBE_LINK_CALLBACK,
    passReqToCallback: true
  },
  (req, accessToken, refreshToken, profile, cb) => {
    AuthService.LinkAccount(req, profile, refreshToken, accessToken, cb);
  }
);

passport.use("spotify", spotifyAuth);
passport.use("spotifyLink", spotifyLink);
passport.use("youtube", youtubeAuth);
passport.use("youtubeLink", youtubeLink);

refresh.use(spotifyAuth);
refresh.use(youtubeAuth);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: req => req.cookies && req.cookies.kordUser,
      secretOrKey: process.env.JWT_SECRET,
      passReqToCallback: true
    },
    async (req, jwtPayload, done) => {
      if (Date.now() > jwtPayload.expires) {
        return done("jwt expired", null);
      }

      req.user = jwtPayload;
      return done(null, jwtPayload);
    }
  )
);
