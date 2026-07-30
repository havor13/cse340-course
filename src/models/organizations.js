// src/models/organizations.js
import db from "./db.js";

// ✅ Get all organizations
export async function getAllOrganizations() {
  const query = `
    SELECT organization_id, name, description, contact_email, logo_filename
    FROM public.organizations
    ORDER BY organization_id;
  `;
  const result = await db.query(query);
  return result.rows;
}

// ✅ Get a single organization by ID
export async function getOrganizationById(id) {
  const query = `
    SELECT organization_id, name, description, contact_email, logo_filename
    FROM public.organizations
    WHERE organization_id = $1;
  `;
  const result = await db.query(query, [id]);
  return result.rows[0];
}

// ✅ Create a new organization with error handling
export async function createOrganization(name, description, contactEmail, logoFilename) {
  const query = `
    INSERT INTO public.organizations (name, description, contact_email, logo_filename)
    VALUES ($1, $2, $3, $4)
    RETURNING organization_id, name, description, contact_email, logo_filename;
  `;
  try {
    const result = await db.query(query, [name, description, contactEmail, logoFilename]);

    if (result.rows.length === 0) {
      throw new Error("Failed to create organization");
    }

    return result.rows[0];
  } catch (err) {
    // Handle duplicate email error (Postgres unique violation)
    if (err.code === "23505") {
      throw new Error("Duplicate email: An organization with this email already exists.");
    }
    throw err;
  }
}

// ✅ Update an existing organization with error handling
export async function updateOrganization(id, name, description, contactEmail, logoFilename) {
  const query = `
    UPDATE public.organizations
    SET name = $1, description = $2, contact_email = $3, logo_filename = $4
    WHERE organization_id = $5
    RETURNING organization_id, name, description, contact_email, logo_filename;
  `;
  try {
    const result = await db.query(query, [name, description, contactEmail, logoFilename, id]);

    if (result.rows.length === 0) {
      throw new Error("Failed to update organization");
    }

    return result.rows[0];
  } catch (err) {
    if (err.code === "23505") {
      throw new Error("Duplicate email: Another organization already uses this email.");
    }
    throw err;
  }
}
