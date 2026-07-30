import { body, validationResult } from 'express-validator';
import * as organizationModel from "../models/organizations.js";
import * as projectModel from "../models/projects.js";

// ✅ Validation rules
const organizationValidation = [
  body('name')
    .trim()
    .escape()
    .notEmpty().withMessage('Organization name is required')
    .isLength({ min: 3, max: 150 })
    .withMessage('Organization name must be between 3 and 150 characters'),

  body('description')
    .trim()
    .escape()
    .notEmpty().withMessage('Organization description is required')
    .isLength({ max: 500 })
    .withMessage('Organization description cannot exceed 500 characters'),

  body('contactEmail')
    .normalizeEmail()
    .notEmpty().withMessage('Contact email is required')
    .isEmail().withMessage('Please provide a valid email address'),

  body('logo_filename')
    .optional()
    .trim()
    .escape()
    .isLength({ max: 255 })
    .withMessage('Logo filename cannot exceed 255 characters')
];

// ✅ List all organizations
async function listOrganizations(req, res) {
  try {
    const organizations = await organizationModel.getAllOrganizations();
    res.render("organizations", { 
      title: "Organizations", 
      organizations,
      errors: [] 
    });
  } catch (err) {
    console.error("❌ Error fetching organizations:", err.message);
    req.flash("error", "Failed to load organizations.");
    res.redirect("/");
  }
}

// ✅ Show organization detail
async function organizationDetail(req, res) {
  try {
    const organizationId = parseInt(req.params.id, 10);
    const organization = await organizationModel.getOrganizationById(organizationId);
    const projects = await projectModel.getProjectsByOrganizationId(organizationId);

    if (!organization) {
      req.flash("error", "Organization not found.");
      return res.redirect("/organizations");
    }

    res.render("organization", { 
      title: organization.name, 
      organization, 
      projects, 
      errors: [] 
    });
  } catch (err) {
    console.error("❌ Error in organizationDetail:", err.message);
    req.flash("error", "Server error occurred while loading organization.");
    res.redirect("/organizations");
  }
}

// ✅ Show form for creating new organization
function showNewOrganizationForm(req, res) {
  res.render("new-organization", { 
    title: "Add New Organization", 
    errors: [], 
    oldInput: {} 
  });
}

// ✅ Handle new organization form submission
const processNewOrganizationForm = async (req, res) => {
  const results = validationResult(req);
  if (!results.isEmpty()) {
    // Loop through validation errors and flash them
    results.array().forEach((error) => {
      req.flash('error', error.msg);
    });
    return res.redirect("/new-organization");
  }

  const { name, description, contactEmail } = req.body;
  const logo = 'placeholder-logo.png';

  try {
    const newOrg = await organizationModel.createOrganization(
      name, 
      description, 
      contactEmail, 
      logo
    );
    req.flash('success', 'Organization created successfully!');
    return res.redirect(`/organization/${newOrg.organization_id}`);
  } catch (err) {
    console.error("❌ Error creating organization:", err.message);

    if (err.code === '23505') {
      req.flash('error', 'An organization with this email already exists.');
    } else {
      req.flash('error', 'Server Error. Could not create organization.');
    }

    return res.redirect("/new-organization");
  }
}

// ✅ Show form for editing organization
async function showEditOrganizationForm(req, res) {
  try {
    const organizationId = parseInt(req.params.id, 10);
    const organization = await organizationModel.getOrganizationById(organizationId);
    if (!organization) {
      req.flash("error", "Organization not found.");
      return res.redirect("/organizations");
    }
    res.render("edit-organization", { 
      title: "Edit Organization", 
      organization, 
      errors: [], 
      oldInput: {} 
    });
  } catch (err) {
    console.error("❌ Error loading edit form:", err.message);
    req.flash("error", "Server error occurred while loading edit form.");
    res.redirect("/organizations");
  }
}

// ✅ Handle update organization POST
async function updateOrganization(req, res) {
  const { name, description, contactEmail, logo_filename } = req.body;
  const id = parseInt(req.params.id, 10);

  const results = validationResult(req);
  if (!results.isEmpty()) {
    const organization = await organizationModel.getOrganizationById(id);
    return res.render("edit-organization", { 
      title: "Edit Organization", 
      organization, 
      errors: results.array(),
      oldInput: req.body
    });
  }

  try {
    await organizationModel.updateOrganization(
      id, 
      name, 
      description, 
      contactEmail, 
      logo_filename || 'placeholder-logo.png'
    );
    req.flash('success', 'Organization updated successfully!');
    return res.redirect(`/organization/${id}`);
  } catch (err) {
    console.error("❌ Error updating organization:", err.message);

    if (err.code === '23505') {
      req.flash('error', 'Another organization already uses this email.');
    } else {
      req.flash('error', 'Server Error. Could not update organization.');
    }

    return res.redirect(`/edit-organization/${id}`);
  }
}

export default {
  listOrganizations,
  organizationDetail,
  showNewOrganizationForm,
  processNewOrganizationForm,
  showEditOrganizationForm,
  updateOrganization
};

export { organizationValidation };
