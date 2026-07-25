// src/routes/categories.js
import express from "express";
import categoryController, { categoryValidation } from "../controllers/categories.js";
import * as categoryModel from "../models/categories.js";

const router = express.Router();

// ✅ List all categories
router.get("/categories", async (req, res) => {
  try {
    const categories = await categoryModel.getAllCategories();
    res.render("categories", { title: "Categories", categories });
  } catch (err) {
    console.error("❌ Error loading categories:", err.message);
    res.status(500).render("500", { title: "Server Error", error: err.message });
  }
});

// ✅ Category detail page
router.get("/category/:id", categoryController.categoryDetail);

// ✅ Show new category form
router.get("/new-category", categoryController.showNewCategoryForm);

// ✅ Handle new category form submission with validation middleware
router.post("/new-category", categoryValidation, categoryController.createCategory);

// ✅ Show edit category form
router.get("/edit-category/:id", categoryController.showEditCategoryForm);

// ✅ Handle edit category form submission with validation middleware
router.post("/edit-category/:id", categoryValidation, categoryController.updateCategory);

// ✅ Show assign categories form for a project
router.get("/project/:projectId/assign-categories", categoryController.showAssignCategoriesForm);

// ✅ Handle assign categories form submission
router.post("/project/:projectId/assign-categories", categoryController.processAssignCategoriesForm);

// ✅ Only one default export at the bottom
export default router;
