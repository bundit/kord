const cookieParser = require("cookie-parser");
const express = require("express");
const passport = require("passport");
const path = require("path");

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

// MIDDLEWARE
if (isProduction) {
  app.use(forceSSL);
  app.use(forceWWW);
}
app.use(cookieParser());
app.use(passport.initialize());
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/api", apiRoutes);

if (isProduction) {
  app.use("/", indexRoutes);
  app.use("/app", appRoutes);

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "landing", "public", "index.html"));
  });
} else if (!isProduction) {
  // Serve react-app develment server in development
  app.get("/app*", (req, res) => {
    res.redirect(`http://localhost:3000${req.originalUrl}`);
  });
  // Serve gatsby server in development
  app.get("*", (req, res) => {
    res.redirect("https://localhost:8000/");
  });
}

const port = process.env.PORT || 8888;
app.listen(port, () => console.log(`Listening on port ${port}.`));
