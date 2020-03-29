const express = require("express");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const path = require("path");

require("./config/database-setup");
require("./config/passport-setup");

const authRoutes = require("./routes/auth-routes");
const appRoutes = require("./routes/app-routes");
const indexRoutes = require("./routes/index-routes");
const userRoutes = require("./routes/user-routes");

const app = express();
// MIDDLEWARE
app.use(cookieParser());
app.use(passport.initialize());

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
//
// PRODUCTION
if (process.env.NODE_ENV === "production") {
  app.use("/", indexRoutes);
  app.use("/app", appRoutes);

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "landing", "public", "index.html"));
  });
  //
  // DEVELOPMENT
} else if (process.env.NODE_ENV === "development") {
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
