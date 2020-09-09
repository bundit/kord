const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: process.env.ENVIRONMENT === "development"
  },
  max: 20
});

pool.connect((err, client, release) => {
  if (err) {
    console.error(`Error connecting: ${err.stack}`);
  } else {
    client.query("SELECT NOW();", (queryErr, res) => {
      release();
      if (queryErr) {
        return console.error(`Error executing query: ${err.stack}`);
      }

      return console.log(`Connected to DB ${JSON.stringify(res.rows[0])}`);
    });
  }
});

module.exports = {
  // For executing one query
  query: (text, params, callback) => pool.query(text, params, callback),
  // For executing multiple queries with one connection
  getClient: async callback => {
    const client = await pool.connect();
    try {
      await callback(client);
    } catch (err) {
      console.error(`Error executing query: ${err.stack}`);
    } finally {
      client.release();
    }
  },
  // For executing a transaction
  transaction: async callback => {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      try {
        await callback(client);
        client.query("COMMIT");
      } catch (e) {
        client.query("ROLLBACK");
        throw e;
      }
    } finally {
      client.release();
    }
  }
};
