module.exports = function forceWWW(req, res, next) {
  if (req.headers.host.slice(0, 4) !== "www.") {
    const { host } = req.headers;
    return res.redirect(301, `${req.protocol}://www.${host}${req.originalUrl}`);
  }
  return next();
};
