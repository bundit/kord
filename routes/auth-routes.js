const router = require("express").Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const jwtDecode = require("jwt-decode");
const refresh = require("passport-oauth2-refresh");

const db = require("../config/database-setup");
const spotifyAuthRoutes = require("./spotify-auth-routes");
// const mixcloudAuthRoutes = require("./mixcloud-auth-routes");

router.use("/spotify", spotifyAuthRoutes);
// router.use("/mixcloud", mixcloudAuthRoutes);

router.get("/token", (req, res, next) => {
  passport.authenticate("jwt", (err, user, info) => {
    const expires = Date.now() + parseInt(process.env.JWT_TOKEN_EXPIRE, 10);

    if (err) {
      return res.send(err);
    }

    if (!user) {
      return res.send(`user is not logged in & info = ${info}`);
    }

    const newToken = jwt.sign(
      {
        email: user.email,
        expires
      },
      process.env.JWT_SECRET
    );

    res.cookie("kordUser", newToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7
      // maxAge: expires
      // secure: process.env.NODE_ENV === "production"
    });

    return res.send("OK");
  })(req, res, next);
});

router.get("/:provider/refresh", (req, res, next) => {
  passport.authenticate("jwt", async (err, user, info) => {
    const userCookie = req.cookies.kordUser;
    const kordUser = jwtDecode(userCookie);
    const { provider } = req.params;

    if (err) {
      return res.send(err);
    }

    if (!user) {
      return res.send(`user is not logged in & info = ${info}`);
    }

    // const
    const query = {
      text: `SELECT *
             FROM (users JOIN user_profiles
             ON users.id=user_profiles.user_id)
             WHERE users.email=$1 AND user_profiles.oauth_provider=$2`,
      values: [kordUser.email, provider]
    };
    // const data = db.query(query);
    const {
      rows: [firstRow]
    } = await db.query(query);

    if (!firstRow) {
      return res.send("Error: provider connection does not exist");
    }

    refresh.requestNewAccessToken(
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
  })(req, res, next);
});

module.exports = router;
