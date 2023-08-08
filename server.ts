import { Request, Response } from "express";
import { BUILD_ENV, PORT } from "./lib/constants";
import bodyParser = require("body-parser");
import cookieParser = require("cookie-parser");
import express = require("express");
import passport = require("passport");
import path = require("path");
import morgan = require("morgan");

require("./config/database-setup");
require("./config/passport-setup");

import forceSSL = require("./middleware/ssl");
import forceWWW = require("./middleware/www");
import appRoutes = require("./routes/app-routes");
import authRoutes = require("./routes/auth-routes");
import indexRoutes = require("./routes/index-routes");
import userRoutes = require("./routes/user-routes");
import apiRoutes = require("./routes/api-routes");

const app = express();
const isProduction = app.get("env") === "production";
const isPreProd = BUILD_ENV !== "production";

// MIDDLEWARE
if (isProduction && !isPreProd) {
  app.use(forceSSL);
  app.use(forceWWW);
}
app.use(morgan("tiny"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(passport.initialize());
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/api", apiRoutes);

if (isProduction) {
  app.use("/", indexRoutes);
  app.use("/app", appRoutes);

  app.get("*", (_req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, "landing", "public", "index.html"));
  });
} else if (!isProduction) {
  // Serve react-app develment server in development
  app.get("/app*", (req: Request, res: Response) => {
    res.redirect(`http://localhost:3000${req.originalUrl}`);
  });
  // Serve gatsby server in development
  app.get("*", (req: Request, res: Response) => {
    res.redirect(`http://localhost:8000${req.originalUrl}`);
  });
}

const port = PORT || 8888;
app.listen(port, () => console.log(`Listening on port ${port}.`));
