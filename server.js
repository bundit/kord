const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");

require("./config/database-setup");
require("./config/passport-setup");

const authRoutes = require("./routes/auth-routes");

const app = express();
app.use(cookieParser());
app.use("/auth", authRoutes);

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use("/app", express.static(path.resolve(__dirname, "client", "build")));
  app.use(express.static(path.resolve(__dirname, "landing", "public")));

  // Send application on /app
  app.get("/app*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });

  // Send landing page on all other routes
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "landing", "public", "index.html"));
  });
} else if (process.env.NODE_ENV === "development") {
  // Serve react-app develment server in development
  app.get("/app", (req, res) => {
    res.redirect("http://localhost:3000/app");
  });
  // Serve gatsby server in development
  app.get("*", (req, res) => {
    res.redirect("https://localhost:8000/");
  });
}

const port = process.env.PORT || 8888;
app.listen(port, () => console.log(`Listening on port ${port}.`));
