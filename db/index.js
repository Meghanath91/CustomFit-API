const { Pool } = require("pg");

//****connect database using node-postgress****//
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:true
});
module.exports = pool;
