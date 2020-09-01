const router = require("express").Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

router.get(
  "/",
  passport.authenticate("youtube", {
    scope: [
      "email",
      "profile",
      "openid",
      "https://www.googleapis.com/auth/youtube"
    ],
    showDialog: true,
    prompt: "consent",
    accessType: "offline"
  }),
  // eslint-disable-next-line
  (res, req) => {
    // The request will be redirected to spotify for authentication, so this
    // function will not be called.
  }
);

router.get(
  "/callback",
  passport.authenticate("youtube", { failureRedirect: "/login" }),
  (req, res) => {
    // This code block will only execute if login is successful
    const { user } = req;

    // const isProduction = process.env.NODE_ENV === "production";
    const expires = Date.now() + parseInt(process.env.JWT_TOKEN_EXPIRE, 10);

    // JWT payload
    const payload = {
      id: user.id,
      email: user.email,
      expires
    };

    /** assigns payload to req.user */
    req.login(payload, { session: false }, error => {
      if (error) {
        res.status(400).send({ error });
      }

      /** generate a signed json web token and return it in the response */
      const token = jwt.sign(JSON.stringify(payload), process.env.JWT_SECRET);

      /** assign our jwt to the cookie */
      res.cookie("kordUser", token, {
        httpOnly: true,
        maxAge: process.env.JWT_TOKEN_EXPIRE,
        secure: process.env.NODE_ENV === "production",
        overwrite: true
      });
      res.redirect(
        `/app/library#source=youtube&accessToken=${user.accessToken}&userId=${user.id}&login=true`
      );
    });
  }
);

router.use("/link", (req, res, next) => {
  passport.authenticate("jwt", (err, user, info) => {
    if (err) {
      return res.status(403).redirect("/login");
    }

    if (!user) {
      return res.status(401).redirect("/login");
    }

    return next();
  })(req, res, next);
});

router.get(
  "/link",
  passport.authenticate("youtubeLink", {
    scope: [
      "email",
      "profile",
      "openid",
      "https://www.googleapis.com/auth/youtube"
    ],
    showDialog: true,
    prompt: "consent",
    accessType: "offline"
  }),
  // eslint-disable-next-line
  (res, req) => {
    // The request will be redirected to spotify for authentication, so this
    // function will not be called.
  }
);

router.get(
  "/link/callback",
  passport.authenticate("youtubeLink", { failureRedirect: "/login" }),
  (req, res) => {
    const { user } = req;

    const expires = Date.now() + parseInt(process.env.JWT_TOKEN_EXPIRE, 10);

    // JWT payload
    const payload = {
      id: user.id,
      email: user.email,
      expires
    };

    /** assigns payload to req.user */
    req.login(payload, { session: false }, error => {
      if (error) {
        res.status(400).send({ error: error.toString() });
      }

      res.redirect(
        `/app/library#source=youtube&accessToken=${user.accessToken}&userId=${user.id}`
      );
    });
  }
);

module.exports = router;
