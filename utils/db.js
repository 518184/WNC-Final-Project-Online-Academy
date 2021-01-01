const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../config/.env') })
const knex = require('knex')({
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
  },
  pool: {
    min: 0,
    max: 50
  }
});

module.exports = knex;