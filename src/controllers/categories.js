// src/controllers/categories.js
import { body, validationResult } from "express-validator";
import * as categoryModel from "../models/categories.js";
import * as projectModel from "../models/projects.js";

// Validation rules for category form
const categoryValidation = [
  body("name")
    .trim()
    .escape()
    .notEmpty().withMessage("Category name is required")
    .isLength({ min: 3, max: 100 }).withMessage("Category name must be between 3 and 100 characters")
];

// Show category detail
async function categoryDetail(req, res) {
  try {
    const categoryId = parseInt(req.params.id, 10); // ✅ cast to integer
    const category = await categoryModel.getCategoryById(categoryId);
    const projects = await projectModel.getProjectsByCategoryId(categoryId);

    if (!category) {
      return res.status(404).render("404", { title: "Not Found", message: "Category not found" });
    }

    res.render("category", { title: category.name, category, projects });
  } catch (err) {
    console.error("❌ Error in categoryDetail:", err);
    res.status(500).render("500", { title: "Server Error", error: err });
  }
}

// Show form for creating new category
function showNewCategoryForm(req, res) {
  res.render("new-category", { title: "New Category", errors: null });
}

// Handle create category POST
async function createCategory(req, res) {
  const results = validationResult(req);
  if (!results.isEmpty()) {
    return res.render("new-category", { 
      title: "New Category", 
      errors: results.array() 
    });
  }

  const { name } = req.body;
  try {
    const category = await categoryModel.createCategory(name); // returns full row
    req.flash("success", "Category created successfully!");
    res.redirect(`/category/${category.category_id}`); // ✅ use category_id from row
  } catch (err) {
    console.error("❌ Error creating category:", err);
    req.flash("error", "Failed to create category.");
    res.redirect("/categories");
  }
}

// Show form for editing category
async function showEditCategoryForm(req, res) {
  try {
    const categoryId = parseInt(req.params.id, 10); // ✅ cast to integer
    const category = await categoryModel.getCategoryById(categoryId);

    if (!category) {
      return res.status(404).render("404", { title: "Not Found", message: "Category not found" });
    }

    res.render("edit-category", { title: "Edit Category", category, errors: null });
  } catch (err) {
    console.error("❌ Error loading edit form:", err);
    res.status(500).render("500", { title: "Server Error", error: err });
  }
}

// Handle update category POST
async function updateCategory(req, res) {
  const id = parseInt(req.params.id, 10); // ✅ cast to integer
  const results = validationResult(req);

  if (!results.isEmpty()) {
    const category = await categoryModel.getCategoryById(id);
    return res.render("edit-category", { 
      title: "Edit Category", 
      category, 
      errors: results.array() 
    });
  }

  const { name } = req.body;
  try {
    await categoryModel.updateCategory(id, name);
    req.flash("success", "Category updated successfully!");
    res.redirect(`/category/${id}`);
  } catch (err) {
    console.error("❌ Error updating category:", err);
    req.flash("error", "Failed to update category.");
    res.redirect("/categories");
  }
}

export default { 
  categoryDetail, 
  showNewCategoryForm, 
  createCategory, 
  showEditCategoryForm, 
  updateCategory 
};

export { categoryValidation };
