const pool = require('../../db/connection');

async function getAllOrganizations() {
  const result = await pool.query('SELECT * FROM organizations ORDER BY name');
  return result.rows;
}

module.exports = { getAllOrganizations };
