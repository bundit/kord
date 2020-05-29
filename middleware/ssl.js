module.exports = function forceSSL(req, res, next) {
  if (req.header("x-forwarded-proto") !== "https") {
    res.redirect(`https://www.${req.header("host")}${req.url}`);
  } else next();
};
