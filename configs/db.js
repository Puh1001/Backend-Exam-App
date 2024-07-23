require("dotenv").config();

const mysql = require("mysql2/promise");

const connection = mysql.createPool({
  host: process.env.DOMAIN,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB,
});

module.exports = connection;
