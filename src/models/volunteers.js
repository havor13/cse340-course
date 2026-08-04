// src/models/volunteers.js
import db from "./db.js";

// ✅ Add volunteer
export async function addVolunteer(userId, projectId) {
  const result = await db.query(
    `INSERT INTO project_volunteers (user_id, project_id)
     VALUES ($1, $2)
     ON CONFLICT (user_id, project_id) DO NOTHING
     RETURNING *`,
    [userId, projectId]
  );
  return result.rows[0];
}

// ✅ Remove volunteer
export async function removeVolunteer(userId, projectId) {
  const result = await db.query(
    `DELETE FROM project_volunteers
     WHERE user_id = $1 AND project_id = $2
     RETURNING *`,
    [userId, projectId]
  );
  return result.rows[0];
}

// ✅ Get projects a user volunteers for
export async function getUserVolunteers(userId) {
  const result = await db.query(
    `SELECT p.project_id, p.title, p.description
     FROM projects p
     JOIN project_volunteers pv ON p.project_id = pv.project_id
     WHERE pv.user_id = $1`,
    [userId]
  );
  return result.rows;
}

// ✅ Check if a user is volunteering for a specific project
export async function isVolunteer(userId, projectId) {
  const result = await db.query(
    `SELECT 1
     FROM project_volunteers
     WHERE user_id = $1 AND project_id = $2
     LIMIT 1`,
    [userId, projectId]
  );
  return result.rowCount > 0; // returns true if a row exists
}
