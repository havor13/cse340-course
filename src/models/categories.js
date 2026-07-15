import db from "./db.js";

// Get all categories
export async function getAllCategories() {
  const result = await db.query(
    `SELECT * FROM categories ORDER BY category_id`
  );
  return result.rows;
}

// Get a single category by ID
export async function getCategoryById(id) {
  const result = await db.query(
    `SELECT * FROM categories WHERE category_id = $1`,
    [id]
  );
  return result.rows[0];
}

// Get all categories for a given project
export async function getCategoriesByProjectId(projectId) {
  const result = await db.query(
    `SELECT c.* FROM categories c
     JOIN project_category pc ON c.category_id = pc.category_id
     WHERE pc.project_id = $1`,
    [projectId]
  );
  return result.rows;
}
