import db from "./db.js";

// Get all projects (with organization info + categories)
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

// Get a single project by ID (with organization info + categories)
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

// Get all projects for a given category (with organization info)
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

// Get all projects for a given organization (with categories)
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
