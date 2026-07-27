// src/models/projects.js
import db from "./db.js";

// ----------------------
// Get all projects (with organization info + categories)
// ----------------------
export async function getAllProjects() {
  const result = await db.query(
    `SELECT p.*, o.name AS organization_name,
            COALESCE(
              json_agg(
                DISTINCT jsonb_build_object(
                  'category_id', c.category_id,
                  'name', c.name
                )
              ) FILTER (WHERE c.category_id IS NOT NULL),
              '[]'
            ) AS categories
     FROM projects p
     JOIN organizations o ON p.organization_id = o.organization_id
     LEFT JOIN project_category pc ON p.project_id = pc.project_id
     LEFT JOIN categories c ON c.category_id = pc.category_id
     GROUP BY p.project_id, o.name
     ORDER BY p.project_id`
  );
  return result.rows;
}

// ----------------------
// Get a single project by ID (with organization info + categories)
// ----------------------
export async function getProjectById(id) {
  const result = await db.query(
    `SELECT p.*, o.name AS organization_name,
            COALESCE(
              json_agg(
                DISTINCT jsonb_build_object(
                  'category_id', c.category_id,
                  'name', c.name
                )
              ) FILTER (WHERE c.category_id IS NOT NULL),
              '[]'
            ) AS categories
     FROM projects p
     JOIN organizations o ON p.organization_id = o.organization_id
     LEFT JOIN project_category pc ON p.project_id = pc.project_id
     LEFT JOIN categories c ON c.category_id = pc.category_id
     WHERE p.project_id = $1
     GROUP BY p.project_id, o.name`,
    [id]
  );
  return result.rows[0];
}

// ✅ Alias for controller compatibility
export async function getProjectDetails(id) {
  return await getProjectById(id);
}

// ----------------------
// Get all projects for a given category
// ----------------------
export async function getProjectsByCategoryId(categoryId) {
  const result = await db.query(
    `SELECT p.*, o.name AS organization_name
     FROM projects p
     JOIN project_category pc ON p.project_id = pc.project_id
     JOIN organizations o ON p.organization_id = o.organization_id
     WHERE pc.category_id = $1
     ORDER BY p.project_id`,
    [categoryId]
  );
  return result.rows;
}

// ----------------------
// Get all projects for a given organization (with categories)
// ----------------------
export async function getProjectsByOrganizationId(organizationId) {
  const result = await db.query(
    `SELECT p.*, o.name AS organization_name,
            COALESCE(
              json_agg(
                DISTINCT jsonb_build_object(
                  'category_id', c.category_id,
                  'name', c.name
                )
              ) FILTER (WHERE c.category_id IS NOT NULL),
              '[]'
            ) AS categories
     FROM projects p
     JOIN organizations o ON p.organization_id = o.organization_id
     LEFT JOIN project_category pc ON p.project_id = pc.project_id
     LEFT JOIN categories c ON c.category_id = pc.category_id
     WHERE p.organization_id = $1
     GROUP BY p.project_id, o.name
     ORDER BY p.project_id`,
    [organizationId]
  );
  return result.rows;
}

// ----------------------
// Create a new project
// ----------------------
export async function createProject(title, description, location, projectDate, organizationId) {
  const query = `
    INSERT INTO projects (title, description, location, project_date, organization_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING project_id, title, description, location, project_date, organization_id;
  `;
  const params = [title, description, location, projectDate, organizationId];
  const result = await db.query(query, params);

  if (result.rows.length === 0) {
    throw new Error("Failed to create project");
  }

  if (process.env.ENABLE_SQL_LOGGING === "true") {
    console.log("Created new project with ID:", result.rows[0].project_id);
  }

  return result.rows[0];
}

// ----------------------
// Update an existing project
// ----------------------
export async function updateProject(projectId, title, description, location, projectDate, organizationId) {
  const query = `
    UPDATE projects
    SET title = $1,
        description = $2,
        location = $3,
        project_date = $4,
        organization_id = $5
    WHERE project_id = $6
    RETURNING project_id, title, description, location, project_date, organization_id;
  `;
  const params = [title, description, location, projectDate, organizationId, projectId];
  const result = await db.query(query, params);

  if (result.rows.length === 0) {
    throw new Error("Failed to update project or project not found");
  }

  if (process.env.ENABLE_SQL_LOGGING === "true") {
    console.log("Updated project with ID:", result.rows[0].project_id);
  }

  return result.rows[0];
}

// ----------------------
// Delete a project
// ----------------------
export async function deleteProject(projectId) {
  const query = `
    DELETE FROM projects
    WHERE project_id = $1
    RETURNING project_id;
  `;
  const result = await db.query(query, [projectId]);

  if (result.rows.length === 0) {
    throw new Error("Failed to delete project or project not found");
  }

  if (process.env.ENABLE_SQL_LOGGING === "true") {
    console.log("Deleted project with ID:", result.rows[0].project_id);
  }

  return result.rows[0];
}

// ----------------------
// Category assignment helpers
// ----------------------

// Get categories assigned to a project
export async function getCategoriesByProjectId(projectId) {
  const result = await db.query(
    `SELECT c.category_id, c.name
     FROM project_category pc
     JOIN categories c ON pc.category_id = c.category_id
     WHERE pc.project_id = $1`,
    [projectId]
  );
  return result.rows;
}

// Update categories for a project
export async function updateProjectCategories(projectId, categoryIds) {
  // Clear existing assignments
  await db.query(`DELETE FROM project_category WHERE project_id = $1`, [projectId]);

  // Insert new assignments
  for (const categoryId of categoryIds) {
    await db.query(
      `INSERT INTO project_category (project_id, category_id)
       VALUES ($1, $2)`,
      [projectId, categoryId]
    );
  }

  if (process.env.ENABLE_SQL_LOGGING === "true") {
    console.log(`Updated categories for project ID: ${projectId}`);
  }
}
