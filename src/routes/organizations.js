// src/routes/organizations.js
import express from "express";
import organizationController from "../controllers/organizations.js";

const router = express.Router();

// List all organizations
router.get("/organizations", organizationController.listOrganizations);

// Organization detail page
router.get("/organization/:id", organizationController.organizationDetail);

export default router;
