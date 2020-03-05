const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: process.env.ENVIRONMENT === "development"
  }
});

pool.connect(err => {
  if (err) {
    console.error(`Error connecting: ${err.stack}`);
  } else {
    console.log("Connected to DB");
  }
});

module.exports = pool;
