// src/controllers/organizations.js
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
    res.render("organizations", { title: "Organizations", organizations });
  } catch (err) {
    console.error("❌ Error fetching organizations:", err.message);
    res.status(500).render("500", { title: "Server Error", error: err.message });
  }
}

// ✅ Show organization detail
async function organizationDetail(req, res) {
  try {
    const organizationId = req.params.id;
    const organization = await organizationModel.getOrganizationById(organizationId);
    const projects = await projectModel.getProjectsByOrganizationId(organizationId);

    if (!organization) {
      return res.status(404).render("404", { title: "Not Found", message: "Organization not found" });
    }

    res.render("organization", { title: organization.name, organization, projects });
  } catch (err) {
    console.error("❌ Error in organizationDetail:", err.message);
    res.status(500).render("500", { title: "Server Error", error: err.message });
  }
}

// ✅ Show form for creating new organization
function showNewOrganizationForm(req, res) {
  res.render("new-organization", { title: "Add New Organization", errors: null, oldInput: {} });
}

// ✅ Handle new organization form submission
const processNewOrganizationForm = async (req, res) => {
  const results = validationResult(req);
  if (!results.isEmpty()) {
    return res.render("new-organization", { 
      title: "Add New Organization", 
      errors: results.array(),
      oldInput: req.body
    });
  }

  const { name, description, contactEmail } = req.body;
  const logo = 'placeholder-logo.png'; // fallback logo

  try {
    const organizationId = await organizationModel.createOrganization(name, description, contactEmail, logo);
    req.flash('success', 'Organization added successfully!');
    res.redirect(`/organization/${organizationId}`);
  } catch (err) {
    console.error("❌ Error creating organization:", err.message);
    res.status(500).render("500", { title: "Server Error", error: err.message });
  }
}

// ✅ Show form for editing organization
async function showEditOrganizationForm(req, res) {
  try {
    const organization = await organizationModel.getOrganizationById(req.params.id);
    if (!organization) {
      return res.status(404).render("404", { title: "Not Found", message: "Organization not found" });
    }
    res.render("edit-organization", { title: "Edit Organization", organization, errors: null, oldInput: {} });
  } catch (err) {
    console.error("❌ Error loading edit form:", err.message);
    res.status(500).render("500", { title: "Server Error", error: err.message });
  }
}

// ✅ Handle update organization POST
async function updateOrganization(req, res) {
  const { name, description, contactEmail, logo_filename } = req.body;
  const id = req.params.id;

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
    res.redirect(`/organization/${id}`);
  } catch (err) {
    console.error("❌ Error updating organization:", err.message);
    res.status(500).render("500", { title: "Server Error", error: err.message });
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
