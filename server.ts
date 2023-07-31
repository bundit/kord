import { Request, Response } from "express";
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const passport = require("passport");
const path = require("path");
const morgan = require("morgan");

require("./config/database-setup");
require("./config/passport-setup");

const forceSSL = require("./middleware/ssl");
const forceWWW = require("./middleware/www");
const appRoutes = require("./routes/app-routes");
const authRoutes = require("./routes/auth-routes");
const indexRoutes = require("./routes/index-routes");
const userRoutes = require("./routes/user-routes");
const apiRoutes = require("./routes/api-routes");

const app = express();
const isProduction = app.get("env") === "production";
const isPreProd = process.env.BUILD_ENV !== "production";

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

const port = process.env.PORT || 8888;
app.listen(port, () => console.log(`Listening on port ${port}.`));
