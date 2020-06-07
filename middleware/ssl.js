module.exports = function forceSSL(req, res, next) {
  if (req.header("x-forwarded-proto") !== "https") {
    return res.redirect(`https://www.${req.header("host")}${req.url}`);
  }

  return next();
};
