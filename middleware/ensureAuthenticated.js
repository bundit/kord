const passport = require("passport");

function ensureAuthenticatedRoute(req, res, next) {
  return passport.authenticate("jwt", (err, user, info) => {
    if (err) {
      return res.redirect(`/login#err=${err}`);
    }

    if (!user) {
      return res.redirect(`/login#err=nouser&other=${info}`);
    }

    // No error, continue to next
    return next();
  })(req, res, next);
}

function ensureAuthenticatedRequest(req, res, next) {
  return passport.authenticate("jwt", (err, user, info) => {
    if (err) {
      return res.status(403).json({ message: info });
    }

    if (!user) {
      return res.status(401).json({ message: info });
    }

    // No error, continue to next
    return next();
  })(req, res, next);
}

module.exports = {
  ensureAuthenticatedRoute,
  ensureAuthenticatedRequest
};
