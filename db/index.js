const { Pool } = require("pg");

//****connect database using node-postgress****//
const pool = new Pool({
  user:"labber",
  password:"labber",
  host:"localhost",
  database:"final",
  port:5432,
  // connectionString: process.env.DATABASE_URL,
  // ssl:true
});
module.exports = pool;
