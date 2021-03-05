const jwt = require("jsonwebtoken");
const jwtDecode = require("jwt-decode");
const refresh = require("passport-oauth2-refresh");
const passport = require("passport");
const db = require("../config/database-setup");

// eslint-disable-next-line
function authNoop(req, res) {
  // The request will be redirected for authentication, so this
  // function will not be called.
}

function authenticateWithOauth(source, isLinking = false) {
  const authStrategy = isLinking ? `${source}Link` : source;

  if (source === "spotify") {
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
        "user-library-read"
      ],
      showDialog: true
    });
  }

  if (source === "youtube") {
    return passport.authenticate(authStrategy, {
      scope: [
        "email",
        "profile",
        "openid",
        "https://www.googleapis.com/auth/youtube"
      ],
      showDialog: true,
      prompt: "consent",
      accessType: "offline"
    });
  }

  return authNoop;
}

function handleOauthCallback(source, isLinking) {
  const authStrategy = isLinking ? `${source}Link` : source;

  return passport.authenticate(authStrategy, { failureRedirect: "/login" });
}

function generateJwtPayload(userId, email) {
  const expires = Date.now() + parseInt(process.env.JWT_TOKEN_EXPIRE, 10);

  return {
    id: userId,
    email,
    expires
  };
}

function signAndSetJWTSessionToken(res, jwtPayload) {
  const token = jwt.sign(jwtPayload, process.env.JWT_SECRET);

  /** assign our jwt to the cookie */
  res.cookie("kordUser", token, {
    httpOnly: true,
    maxAge: process.env.JWT_TOKEN_EXPIRE,
    secure: process.env.NODE_ENV === "production",
    overwrite: true
  });
}

// This code block will only execute if login is successful
function loginUser(source, isLinking = false) {
  return (req, res) => {
    const {
      user: { id, email, accessToken }
    } = req;

    const jwtPayload = generateJwtPayload(id, email);

    /** assigns payload to req.user */
    req.login(jwtPayload, { session: false }, error => {
      if (error) {
        res.status(400).send({ error: error.toString() });
      }

      signAndSetJWTSessionToken(res, jwtPayload);

      const redirectURL = `/app/library#source=${source}&accessToken=${accessToken}&userId=${id}&login=${!isLinking}`;

      res.redirect(redirectURL);
    });
  };
}

function refreshSessionToken(req, res) {
  const {
    user: { id, email }
  } = req;

  const newJwtPayload = generateJwtPayload(id, email);

  signAndSetJWTSessionToken(res, newJwtPayload);

  return res.status(200).json({ message: "success" });
}

async function refreshOauthToken(req, res) {
  const { provider } = req.params;
  const userCookie = req.cookies.kordUser;
  const kordUser = jwtDecode(userCookie);

  const query = {
    text: `SELECT *
         FROM (users JOIN user_profiles
         ON users.id=user_profiles.user_id)
         WHERE users.id=$1 AND user_profiles.oauth_provider=$2`,
    values: [kordUser.id, provider]
  };

  const {
    rows: [firstRow]
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
          error: JSON.parse(error.data)
        });
      }
      return res.send({
        provider: firstRow.oauth_provider,
        accessToken
      });
    }
  );
}

function logoutUser(req, res) {
  res.clearCookie("kordUser");
  res.clearCookie("userBackUnderOneHour");

  return res.status(200).redirect("/login");
}

module.exports = {
  authNoop,
  authenticateWithOauth,
  handleOauthCallback,
  loginUser,
  refreshSessionToken,
  refreshOauthToken,
  logoutUser
};
