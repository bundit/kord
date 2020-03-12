const express = require("express");
const path = require("path");

require("./config/database-setup");
require("./config/passport-setup");

const authRoutes = require("./routes/auth-routes");

const app = express();

app.use("/auth", authRoutes);

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static(path.resolve(__dirname, "client", "build")));

  // Catch all send client build from react-app
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
} else if (process.env.NODE_ENV === "development") {
  // Serve react-app develment server in development
  app.get("*", (req, res) => {
    res.redirect("http://localhost:3000");
  });
}

const port = process.env.PORT || 8888;
app.listen(port, () => console.log(`Listening on port ${port}.`));
