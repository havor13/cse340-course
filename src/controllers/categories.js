import { body, validationResult } from "express-validator";
import * as categoryModel from "../models/categories.js";
import * as projectModel from "../models/projects.js";

// ✅ Validation rules
const categoryValidation = [
  body("name")
    .trim()
    .escape()
    .notEmpty().withMessage("Category name is required")
    .isLength({ min: 3, max: 100 }).withMessage("Category name must be between 3 and 100 characters")
];

// ✅ List all categories
async function listCategories(req, res) {
  try {
    const categories = await categoryModel.getAllCategories();
    res.render("categories", { 
      title: "Categories", 
      categories, 
      errors: [] 
    });
  } catch (err) {
    console.error("❌ Error fetching categories:", err);
    req.flash("error", "Failed to load categories.");
    res.redirect("/");
  }
}

// ✅ Show category detail
async function categoryDetail(req, res) {
  try {
    const categoryId = parseInt(req.params.id, 10);
    if (isNaN(categoryId)) {
      req.flash("error", "Invalid category ID.");
      return res.redirect("/categories");
    }

    const category = await categoryModel.getCategoryById(categoryId);
    const projects = await projectModel.getProjectsByCategoryId(categoryId);

    if (!category) {
      return res.status(404).render("404", { title: "Not Found", message: "Category not found" });
    }

    res.render("category", { 
      title: category.name, 
      category, 
      projects 
    });
  } catch (err) {
    console.error("❌ Error in categoryDetail:", err);
    res.status(500).render("500", { title: "Server Error", error: err });
  }
}

// ✅ Show new category form
function showNewCategoryForm(req, res) {
  res.render("new-category", { 
    title: "New Category", 
    errors: [] 
  });
}

// ✅ Handle create category POST
async function processNewCategoryForm(req, res) {
  const results = validationResult(req);
  if (!results.isEmpty()) {
    return res.render("new-category", { 
      title: "New Category", 
      errors: results.array() 
    });
  }

  const { name } = req.body;
  try {
    const category = await categoryModel.createCategory(name);
    req.flash("success", "Category created successfully!");
    res.redirect(`/category/${category.category_id}`);
  } catch (err) {
    console.error("❌ Error creating category:", err);
    req.flash("error", "Failed to create category.");
    res.redirect("/categories");
  }
}

// ✅ Show edit category form
async function showEditCategoryForm(req, res) {
  try {
    const categoryId = parseInt(req.params.id, 10);
    if (isNaN(categoryId)) {
      req.flash("error", "Invalid category ID.");
      return res.redirect("/categories");
    }

    const category = await categoryModel.getCategoryById(categoryId);

    if (!category) {
      return res.status(404).render("404", { title: "Not Found", message: "Category not found" });
    }

    res.render("edit-category", { 
      title: "Edit Category", 
      category, 
      errors: [] 
    });
  } catch (err) {
    console.error("❌ Error loading edit form:", err);
    res.status(500).render("500", { title: "Server Error", error: err });
  }
}

// ✅ Handle update category POST
async function updateCategory(req, res) {
  const id = parseInt(req.params.id, 10);
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

// ✅ Assign categories to project
async function showAssignCategoriesForm(req, res) {
  try {
    const projectId = req.params.projectId;
    const projectDetails = await projectModel.getProjectDetails(projectId);
    const categories = await categoryModel.getAllCategories();
    const assignedCategories = await categoryModel.getCategoriesByProjectId(projectId);

    res.render("assign-categories", { 
      title: "Assign Categories to Project", 
      projectId, 
      projectDetails, 
      categories, 
      assignedCategories 
    });
  } catch (err) {
    console.error("❌ Error showing assign categories form:", err);
    res.status(500).render("500", { title: "Server Error", error: err });
  }
}

async function processAssignCategoriesForm(req, res) {
  try {
    const projectId = req.params.projectId;
    const selectedCategoryIds = req.body.categoryIds || [];

    const categoryIdsArray = Array.isArray(selectedCategoryIds)
      ? selectedCategoryIds
      : [selectedCategoryIds];

    await categoryModel.updateProjectCategories(projectId, categoryIdsArray);

    req.flash("success", "Categories updated successfully.");
    res.redirect(`/project/${projectId}`);
  } catch (err) {
    console.error("❌ Error processing assign categories form:", err);
    req.flash("error", "Failed to update categories.");
    res.redirect(`/project/${req.params.projectId}`);
  }
}

export default { 
  listCategories,
  categoryDetail, 
  showNewCategoryForm, 
  processNewCategoryForm, 
  showEditCategoryForm, 
  updateCategory,
  showAssignCategoriesForm,
  processAssignCategoriesForm
};

export { categoryValidation };
