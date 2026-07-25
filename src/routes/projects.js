// src/routes/projects.js
import express from "express";
import projectController, { projectValidation } from "../controllers/projects.js";

const router = express.Router();

// ----------------------
// New project routes
// ----------------------

// Show new project form
router.get("/new-project", projectController.showNewProjectForm);

// Handle new project form submission with validation
router.post("/new-project", projectValidation, projectController.processNewProjectForm);

// ----------------------
// Edit project routes
// ----------------------

// Show edit project form
router.get("/edit-project/:id", projectController.showEditProjectForm);

// Handle edit project form submission with validation
router.post("/edit-project/:id", projectValidation, projectController.processEditProjectForm);

// ----------------------
// Delete project route
// ----------------------
router.post("/delete-project/:id", projectController.deleteProject);

// ----------------------
// Assign categories routes
// ----------------------

// Show assign categories form
router.get("/:id/assign-categories", projectController.showAssignCategoriesForm);

// Handle assign categories form submission
router.post("/:id/assign-categories", projectController.processAssignCategoriesForm);

// ----------------------
// Project listing + detail
// ----------------------

// List all projects
router.get("/", projectController.listProjects);

// Project detail (must come last so it doesn't override /new-project or /edit-project)
router.get("/:id", projectController.projectDetail);

export default router;
