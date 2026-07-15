import db from './db.js';

// Get all organizations
const getAllOrganizations = async () => {
  const query = `
    SELECT organization_id, name, description, contact_email, logo_filename
    FROM public.organizations
    ORDER BY organization_id;
  `;
  const result = await db.query(query);
  return result.rows;
};

// Get a single organization by ID
const getOrganizationById = async (id) => {
  const query = `
    SELECT organization_id, name, description, contact_email, logo_filename
    FROM public.organizations
    WHERE organization_id = $1;
  `;
  const result = await db.query(query, [id]);
  return result.rows[0]; // return one row
};

export {
  getAllOrganizations,
  getOrganizationById
};
