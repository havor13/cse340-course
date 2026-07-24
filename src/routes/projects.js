// src/routes/projects.js
import express from "express";
import projectController, { projectValidation } from "../controllers/projects.js";

const router = express.Router();

// Show new project form
router.get("/new-project", projectController.showNewProjectForm);

// Handle new project form submission with validation
router.post("/new-project", projectValidation, projectController.processNewProjectForm);

// Show edit project form
router.get("/edit-project/:id", projectController.showEditProjectForm);

// Handle edit project form submission with validation
router.post("/edit-project/:id", projectValidation, projectController.updateProject);

// ✅ Optional: Delete project route
router.post("/delete-project/:id", projectController.deleteProject);

// List all projects
router.get("/", projectController.listProjects);

// Project detail (must come last so it doesn't override /new-project or /edit-project)
router.get("/:id", projectController.projectDetail);

export default router;
