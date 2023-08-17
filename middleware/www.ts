import { NextFunction, Request, Response } from "express";

export = function forceWWW(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const urlRegex = /([a-z0-9]+[.])?kord.app/;
  if (req.headers.host) {
    const [host, subdomain] = req.headers.host.match(urlRegex) || [];

    if (subdomain !== "www.") {
      return res.redirect(
        301,
        `${req.protocol}://www.${host}${req.originalUrl}`,
      );
    }
  }

  return next();
};
