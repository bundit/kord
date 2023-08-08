import passport = require("passport");
import refresh = require("passport-oauth2-refresh");
import passportSpotify = require("passport-spotify");
import passportGoogle = require("passport-google-oauth20");
import passportJWT = require("passport-jwt");
import express = require("express");
import {
  JWT_SECRET,
  SPOTIFY_CALLBACK,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_LINK_CALLBACK,
  YOUTUBE_CALLBACK,
  YOUTUBE_CLIENT_ID,
  YOUTUBE_CLIENT_SECRET,
  YOUTUBE_LINK_CALLBACK,
} from "../lib/constants";

const { Strategy: SpotifyStrategy } = passportSpotify;
const { Strategy: GoogleStrategy } = passportGoogle;
const { Strategy: JWTStrategy } = passportJWT;

const AuthService = require("../services/auth");

type OAuthStrategy = Parameters<typeof refresh.use>[0];

passport.serializeUser((user, done) => {
  done(null, user);
});

const spotifyAuth = new SpotifyStrategy(
  {
    clientID: SPOTIFY_CLIENT_ID,
    clientSecret: SPOTIFY_CLIENT_SECRET,
    callbackURL: SPOTIFY_CALLBACK,
  },
  (accessToken, refreshToken, _expiresIn, profile, done) => {
    AuthService.SignUpOrSignIn(profile, refreshToken, accessToken, done);
  },
);

const spotifyLink = new SpotifyStrategy(
  {
    clientID: SPOTIFY_CLIENT_ID,
    clientSecret: SPOTIFY_CLIENT_SECRET,
    callbackURL: SPOTIFY_LINK_CALLBACK,
    passReqToCallback: true,
  },
  (req, accessToken, refreshToken, _expiresIn, profile, done) => {
    AuthService.LinkAccount(req, profile, refreshToken, accessToken, done);
  },
);

const youtubeAuth = new GoogleStrategy(
  {
    clientID: YOUTUBE_CLIENT_ID,
    clientSecret: YOUTUBE_CLIENT_SECRET,
    callbackURL: YOUTUBE_CALLBACK,
  },
  (accessToken, refreshToken, profile, cb) => {
    AuthService.SignUpOrSignIn(profile, refreshToken, accessToken, cb);
  },
);

const youtubeLink = new GoogleStrategy(
  {
    clientID: YOUTUBE_CLIENT_ID,
    clientSecret: YOUTUBE_CLIENT_SECRET,
    callbackURL: YOUTUBE_LINK_CALLBACK,
    passReqToCallback: true,
  },
  (req, accessToken, refreshToken, profile, cb) => {
    AuthService.LinkAccount(req, profile, refreshToken, accessToken, cb);
  },
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: (req) => req.cookies && req.cookies.kordUser,
      secretOrKey: JWT_SECRET,
      passReqToCallback: true,
    },
    async (
      req: express.Request,
      jwtPayload: any,
      done: passportJWT.VerifiedCallback,
    ) => {
      if (Date.now() > jwtPayload.expires) {
        return done("jwt expired", undefined);
      }

      req.user = jwtPayload;
      return done(null, jwtPayload);
    },
  ),
);

passport.use("youtube", youtubeAuth);
passport.use("youtubeLink", youtubeLink);
refresh.use(youtubeAuth);

passport.use("spotify", spotifyAuth);
passport.use("spotifyLink", spotifyLink);
refresh.use(spotifyAuth as OAuthStrategy);
