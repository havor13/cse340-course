// src/models/categories.js
import db from "./db.js";

// ----------------------
// Get all categories
// ----------------------
export async function getAllCategories() {
  const result = await db.query(
    `SELECT * FROM categories ORDER BY category_id`
  );
  return result.rows;
}

// ----------------------
// Get a single category by ID
// ----------------------
export async function getCategoryById(id) {
  const categoryId = parseInt(id, 10);
  const result = await db.query(
    `SELECT * FROM categories WHERE category_id = $1`,
    [categoryId]
  );
  return result.rows[0];
}

// ----------------------
// Get all categories for a given project
// ----------------------
export async function getCategoriesByProjectId(projectId) {
  const projId = parseInt(projectId, 10);
  const result = await db.query(
    `SELECT c.* 
     FROM categories c
     JOIN project_category pc ON c.category_id = pc.category_id
     WHERE pc.project_id = $1`,
    [projId]
  );
  return result.rows;
}

// ----------------------
// Create a new category (with optional image_url)
// ----------------------
export async function createCategory(name, image_url = null) {
  const query = image_url
    ? `INSERT INTO categories (name, description, image_url) 
       VALUES ($1, $2, $3) 
       RETURNING *`
    : `INSERT INTO categories (name, description) 
       VALUES ($1, $2) 
       RETURNING *`;

  const params = image_url
    ? [name, "Projects supporting learning and growth.", image_url]
    : [name, "Projects supporting learning and growth."];

  const result = await db.query(query, params);
  return result.rows[0];
}

// ----------------------
// Update an existing category (with optional image_url)
// ----------------------
export async function updateCategory(id, name, image_url = null) {
  const categoryId = parseInt(id, 10);

  const query = image_url
    ? `UPDATE categories 
       SET name = $1, image_url = $2 
       WHERE category_id = $3 
       RETURNING *`
    : `UPDATE categories 
       SET name = $1 
       WHERE category_id = $2 
       RETURNING *`;

  const params = image_url
    ? [name, image_url, categoryId]
    : [name, categoryId];

  const result = await db.query(query, params);
  return result.rows[0];
}

// ----------------------
// Assign categories to a project
// ----------------------

// Helper: assign a single category to a project
async function assignCategoryToProject(categoryId, projectId) {
  await db.query(
    `INSERT INTO project_category (category_id, project_id)
     VALUES ($1, $2)`,
    [categoryId, projectId]
  );
}

// Update category assignments for a project
export async function updateProjectCategories(projectId, categoryIds) {
  const projId = parseInt(projectId, 10);

  // Remove old assignments
  await db.query(`DELETE FROM project_category WHERE project_id = $1`, [projId]);

  // Add new assignments
  for (const categoryId of categoryIds) {
    const catId = parseInt(categoryId, 10);
    await assignCategoryToProject(catId, projId);
  }

  if (process.env.ENABLE_SQL_LOGGING === "true") {
    console.log(`Updated categories for project ${projId}:`, categoryIds);
  }
}
