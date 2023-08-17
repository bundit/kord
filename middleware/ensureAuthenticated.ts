import passport = require("passport");
import { NextFunction, Request, Response, RequestHandler } from "express";
import { KordUser } from "../types";

function ensureAuthenticatedRoute(
  req: Request,
  res: Response,
  next: NextFunction,
): RequestHandler {
  return passport.authenticate(
    "jwt",
    (err: Error, user: KordUser, info?: string) => {
      if (err) {
        return res.redirect(`/login#err=${err}`);
      }

      if (!user) {
        return res.redirect(`/login#err=nouser&other=${info}`);
      }

      // No error, continue to next
      return next();
    },
  )(req, res, next);
}

function ensureAuthenticatedRequest(
  req: Request,
  res: Response,
  next: NextFunction,
): RequestHandler {
  return passport.authenticate(
    "jwt",
    (err: Error, user: KordUser, info?: string) => {
      if (err) {
        return res.status(403).json({ message: info });
      }

      if (!user) {
        return res.status(401).json({ message: info });
      }

      // No error, continue to next
      return next();
    },
  )(req, res, next);
}

export = {
  ensureAuthenticatedRoute,
  ensureAuthenticatedRequest,
};
