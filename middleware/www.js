module.exports = function forceWWW(req, res, next) {
  const urlRegex = /([a-z0-9]+[.])?kord.app/;
  const [host, subdomain] = req.headers.host.match(urlRegex);

  if (subdomain !== "www.") {
    return res.redirect(301, `${req.protocol}://www.${host}${req.originalUrl}`);
  }
  return next();
};
