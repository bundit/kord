import pg = require("pg");
import { DATABASE_URL, NODE_ENV } from "../lib/constants";

type ClientCallbackHandler = (client: pg.PoolClient) => void;

const { Pool } = pg;

const pool: pg.Pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: NODE_ENV === "development",
  },
  max: 20,
});

pool.connect((err: Error, client: pg.PoolClient, done) => {
  if (err) {
    console.error(`Error connecting: ${err.stack}`);
  } else {
    client.query("SELECT NOW();", (queryErr: Error, res: pg.QueryResult) => {
      done();
      if (queryErr) {
        return console.error(`Error executing query: ${queryErr.stack}`);
      }

      return console.log(`Connected to DB ${JSON.stringify(res.rows[0])}`);
    });
  }
});

export = {
  // For executing one query
  query: <T extends pg.QueryResultRow>(queryConfig: pg.QueryConfig) => pool.query<T>(queryConfig),
  // For executing multiple queries with one connection
  getClient: async (callback: ClientCallbackHandler) => {
    const client = await pool.connect();
    try {
      await callback(client);
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error executing query: ${error.stack}`);
      }
    } finally {
      client.release();
    }
  },
  // For executing a transaction
  transaction: async (callback: ClientCallbackHandler) => {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      try {
        await callback(client);
        client.query("COMMIT");
      } catch (error) {
        if (error instanceof Error) {
          console.error(`Error executing transaction: ${error.stack}`);
        }
        client.query("ROLLBACK");
        throw error;
      }
    } finally {
      client.release();
    }
  },
};
