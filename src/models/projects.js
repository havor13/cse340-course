const pool = require('../../db/connection');

async function getAllProjects() {
  const result = await pool.query('SELECT * FROM projects ORDER BY name');
  return result.rows;
}

module.exports = { getAllProjects };
