import { NextFunction, Request, Response } from "express";

export = function forceSSL(req: Request, res: Response, next: NextFunction) {
  if (req.header("x-forwarded-proto") !== "https") {
    return res.redirect(`https://www.${req.header("host")}${req.url}`);
  }

  return next();
};
