// src/routes/organizations.js
import express from "express";
import organizationController, { organizationValidation } from "../controllers/organizations.js";

const router = express.Router();

// ✅ List all organizations
router.get("/organizations", organizationController.listOrganizations);

// ✅ Organization detail page (only allow numeric IDs)
router.get("/organization/:id(\\d+)", organizationController.organizationDetail);

// ✅ Show new organization form
router.get("/new-organization", organizationController.showNewOrganizationForm);

// ✅ Handle new organization form submission (with validation middleware)
router.post(
  "/new-organization",
  organizationValidation,
  organizationController.processNewOrganizationForm
);

// ✅ Show edit organization form (only allow numeric IDs)
router.get("/edit-organization/:id(\\d+)", organizationController.showEditOrganizationForm);

// ✅ Handle edit organization form submission (with validation middleware)
router.post(
  "/edit-organization/:id(\\d+)",
  organizationValidation,
  organizationController.updateOrganization
);

export default router;
