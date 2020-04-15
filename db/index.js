const { Pool } = require("pg");

//****connect database using node-postgress****//
const pool = new Pool({
  user: "labber",
  password: "labber",
  host: "localhost",
  database: "final",
  port: 5432
});
module.exports = pool;


const client = new pg.Client({
  connectionString: process.env.DATABASE_URL || ""
});

client
  .connect()
  .catch(e => console.log(`Error connecting to Postgres server:\n${e}`));

module.exports = client;
