const { Pool } = require("pg");
require('dotenv').config();


const pool = new Pool({
  user: process.env.PS_USER,            // your PostgreSQL username
  host: process.env.PS_HOST,           // PostgreSQL server address
  database: process.env.PS_DB,     // your DB name
  password: process.env.PS_PASS,    // your PostgreSQL password
  port: process.env.PS_PORT,                  // default PostgreSQL port
});

module.exports = pool;