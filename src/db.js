const { Pool } = require('pg');

const logger = require('./logger');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = {
  query: (query) => pool.query(query),
  query_with_params: (text, params) => pool.query(text, params),
}
