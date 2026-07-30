// src/routes/categories.js
import express from "express";
import categoryController, { categoryValidation } from "../controllers/categories.js";

const router = express.Router();

// ✅ List all categories
router.get("/categories", categoryController.listCategories);

// ✅ Show single category detail (numeric IDs only)
router.get("/category/:id(\\d+)", categoryController.categoryDetail);

// ✅ Show new category form
router.get("/new-category", categoryController.showNewCategoryForm);

// ✅ Handle new category form submission (with validation middleware)
router.post(
  "/new-category",
  categoryValidation,
  categoryController.processNewCategoryForm
);

// ✅ Show edit category form (numeric IDs only)
router.get("/edit-category/:id(\\d+)", categoryController.showEditCategoryForm);

// ✅ Handle edit category form submission (with validation middleware)
router.post(
  "/edit-category/:id(\\d+)",
  categoryValidation,
  categoryController.updateCategory
);

// ✅ Show assign categories form for a project (numeric project IDs only)
router.get(
  "/project/:projectId(\\d+)/assign-categories",
  categoryController.showAssignCategoriesForm
);

// ✅ Handle assign categories form submission
router.post(
  "/project/:projectId(\\d+)/assign-categories",
  categoryController.processAssignCategoriesForm
);

export default router;
