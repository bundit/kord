import jwt = require("jsonwebtoken");
import { Request, Response, Handler } from "express";
import jwtDecode from "jwt-decode";
import refresh = require("passport-oauth2-refresh");
import passport = require("passport");
import { JWT_SECRET, JWT_TOKEN_EXPIRE, NODE_ENV } from "../lib/constants";
import { KordJWT, KordUser } from "../types";
import { Source } from "../types/common/kord";
import db = require("../config/database-setup");

declare global {
  // eslint-disable-next-line no-unused-vars
  namespace Express {
    // eslint-disable-next-line no-unused-vars
    interface User extends KordUser {}
  }
}

// eslint-disable-next-line
function authNoop(_req: Request, _res: Response) {
  // The request will be redirected for authentication, so this
  // function will not be called.
}

function authenticateWithOauth(
  source: Source,
  isLinking: boolean = false,
): Handler {
  const authStrategy = isLinking ? `${source}Link` : source;

  if (source === "spotify") {
    // @ts-ignore
    return passport.authenticate(authStrategy, {
      scope: [
        "user-read-email",
        "user-read-private",
        "user-read-playback-state",
        "streaming",
        "user-modify-playback-state",
        "playlist-modify-public",
        "user-library-modify",
        "user-top-read",
        "playlist-read-collaborative",
        "user-read-currently-playing",
        "playlist-read-private",
        "user-follow-read",
        "user-read-recently-played",
        "playlist-modify-private",
        "user-library-read",
      ],
      showDialog: true,
    });
  }

  if (source === "youtube") {
    // @ts-ignore
    return passport.authenticate(authStrategy, {
      scope: [
        "email",
        "profile",
        "openid",
        "https://www.googleapis.com/auth/youtube",
      ],
      showDialog: true,
      prompt: "consent",
      accessType: "offline",
    });
  }

  return authNoop;
}

function handleOauthCallback(
  source: Source,
  isLinking: boolean = false,
): Handler {
  const authStrategy = isLinking ? `${source}Link` : source;

  return passport.authenticate(authStrategy, { failureRedirect: "/login" });
}

function generateJwtPayload(userId: string, email: string): KordJWT {
  const expires = Date.now() + parseInt(JWT_TOKEN_EXPIRE, 10);

  return {
    id: userId,
    email,
    expires,
  };
}

function signAndSetJWTSessionToken(res: Response, jwtPayload: KordJWT): void {
  const token = jwt.sign(jwtPayload, JWT_SECRET);

  res.clearCookie("kordUser");

  res.cookie("kordUser", token, {
    httpOnly: true,
    maxAge: parseInt(JWT_TOKEN_EXPIRE, 10),
    secure: NODE_ENV === "production",
  });
}

function loginUser(source: Source, isLinking: boolean = false) {
  return (req: Request, res: Response) => {
    const { id, email, accessToken } = req.user!;

    const jwtPayload = generateJwtPayload(id, email);

    /** assigns payload to req.user */
    req.login(jwtPayload, { session: false }, (error) => {
      if (error) {
        res.status(400).send({ error: error.toString() });
      }

      signAndSetJWTSessionToken(res, jwtPayload);

      const redirectURL = `/app/library#source=${source}&accessToken=${accessToken}&userId=${id}&login=${!isLinking}`;

      res.redirect(redirectURL);
    });
  };
}

function refreshSessionToken(req: Request, res: Response): Response {
  const { id, email } = req.user!;

  const newJwtPayload = generateJwtPayload(id, email);

  signAndSetJWTSessionToken(res, newJwtPayload);

  return res.status(200).json({ message: "success" });
}

async function refreshOauthToken(
  req: Request,
  res: Response,
): Promise<Response> {
  const { provider } = req.params;
  const userCookie = req.cookies.kordUser;
  const kordUser: KordJWT = jwtDecode(userCookie);

  const query = {
    text: `SELECT *
         FROM (users JOIN user_profiles
         ON users.id=user_profiles.user_id)
         WHERE users.id=$1 AND user_profiles.oauth_provider=$2`,
    values: [kordUser.id, provider],
  };

  const {
    rows: [firstRow],
  } = await db.query(query);

  if (!firstRow) {
    return res.status(404).json({ message: "User not found" });
  }

  return refresh.requestNewAccessToken(
    firstRow.oauth_provider,
    firstRow.refresh_token,
    (error, accessToken) => {
      if (error) {
        return res.send({
          provider: firstRow.oauth_provider,
          error: JSON.parse(error.data),
        });
      }
      return res.send({
        provider: firstRow.oauth_provider,
        accessToken,
      });
    },
  );
}

function logoutUser(_req: Request, res: Response): void {
  res.clearCookie("kordUser");
  res.clearCookie("userBackUnderOneHour");

  return res.status(200).redirect("/login");
}

export = {
  authNoop,
  authenticateWithOauth,
  handleOauthCallback,
  loginUser,
  refreshSessionToken,
  refreshOauthToken,
  logoutUser,
};
