const pool = require('./db');

async function getAllCategories() {
  const result = await pool.query('SELECT * FROM categories ORDER BY name');
  return result.rows;
}

module.exports = { getAllCategories };
