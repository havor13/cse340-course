// src/models/categories.js
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
  const categoryId = parseInt(id, 10); // ✅ ensure integer
  const result = await db.query(
    `SELECT * FROM categories WHERE category_id = $1`,
    [categoryId]
  );
  return result.rows[0];
}

// Get all categories for a given project
export async function getCategoriesByProjectId(projectId) {
  const projId = parseInt(projectId, 10); // ✅ ensure integer
  const result = await db.query(
    `SELECT c.* FROM categories c
     JOIN project_category pc ON c.category_id = pc.category_id
     WHERE pc.project_id = $1`,
    [projId]
  );
  return result.rows;
}

// ✅ Create a new category
export async function createCategory(name) {
  const result = await db.query(
    `INSERT INTO categories (name) VALUES ($1) RETURNING *`,
    [name]
  );
  return result.rows[0];
}

// ✅ Update an existing category
export async function updateCategory(id, name) {
  const categoryId = parseInt(id, 10); // ✅ ensure integer
  const result = await db.query(
    `UPDATE categories 
     SET name = $1 
     WHERE category_id = $2 
     RETURNING *`,
    [name, categoryId]
  );
  return result.rows[0];
}
