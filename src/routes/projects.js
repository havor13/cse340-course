// src/routes/projects.js
import express from "express";
import projectController from "../controllers/projects.js";

const router = express.Router();

// List all projects
router.get("/", projectController.listProjects);

// Project detail
router.get("/:id", projectController.projectDetail);

export default router;