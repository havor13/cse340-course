import { body, validationResult } from "express-validator";
import * as projectModel from "../models/projects.js";
import { getAllOrganizations } from "../models/organizations.js";

// ----------------------
// Validation rules
// ----------------------
const projectValidation = [
  body("title")
    .trim()
    .notEmpty().withMessage("Title is required")
    .isLength({ min: 3, max: 200 }).withMessage("Title must be between 3 and 200 characters"),
  body("description")
    .trim()
    .notEmpty().withMessage("Description is required")
    .isLength({ max: 1000 }).withMessage("Description must be less than 1000 characters"),
  body("location")
    .trim()
    .notEmpty().withMessage("Location is required")
    .isLength({ max: 200 }).withMessage("Location must be less than 200 characters"),
  body("date")
    .notEmpty().withMessage("Date is required")
    .isISO8601().withMessage("Date must be a valid date format"),
  body("organizationId")
    .notEmpty().withMessage("Organization is required")
    .isInt().withMessage("Organization must be a valid integer")
];

// ----------------------
// Project detail
// ----------------------
async function projectDetail(req, res) {
  try {
    const projectId = parseInt(req.params.id, 10);
    const project = await projectModel.getProjectById(projectId);

    if (!project) {
      return res.status(404).render("404", {
        title: "Not Found",
        message: "Project not found"
      });
    }

    res.render("project", {
      title: project.title || project.name,
      project,
      categories: project.categories
    });
  } catch (err) {
    console.error("❌ Error in projectDetail:", err);
    res.status(500).render("500", { title: "Server Error", error: err });
  }
}

// ----------------------
// List all projects
// ----------------------
async function listProjects(req, res) {
  try {
    const projects = await projectModel.getAllProjects();
    res.render("projects", { title: "Projects", projects });
  } catch (err) {
    console.error("❌ Error fetching projects:", err);
    res.status(500).render("500", { title: "Server Error", error: err });
  }
}

// ----------------------
// Show new project form
// ----------------------
async function showNewProjectForm(req, res) {
  try {
    const organizations = await getAllOrganizations();
    res.render("new-project", { 
      title: "New Project", 
      organizations, 
      errors: null, 
      old: {} 
    });
  } catch (err) {
    console.error("❌ Error loading new project form:", err);
    res.status(500).render("500", { title: "Server Error", error: err });
  }
}

// ----------------------
// Process new project form
// ----------------------
async function processNewProjectForm(req, res) {
  const errors = validationResult(req);
  const { title, description, location, date, organizationId } = req.body;

  if (!errors.isEmpty()) {
    const organizations = await getAllOrganizations();
    return res.render("new-project", { 
      title: "New Project", 
      organizations, 
      errors: errors.array(), 
      old: req.body 
    });
  }

  try {
    const projectId = await projectModel.createProject(
      title,
      description,
      location,
      date,
      parseInt(organizationId, 10)
    );
    req.flash("success", "Project created successfully!");
    res.redirect(`/projects/${projectId}`);
  } catch (err) {
    console.error("❌ Error creating project:", err);
    req.flash("error", "Failed to create project.");
    res.redirect("/projects");
  }
}

// ----------------------
// Show edit project form
// ----------------------
async function showEditProjectForm(req, res) {
  try {
    const projectId = parseInt(req.params.id, 10);
    const project = await projectModel.getProjectById(projectId);
    const organizations = await getAllOrganizations();

    if (!project) {
      return res.status(404).render("404", { title: "Not Found", message: "Project not found" });
    }

    // Ensure date is formatted for input[type=date]
    if (project.date instanceof Date) {
      project.date = project.date.toISOString().split("T")[0];
    }

    res.render("edit-project", { 
      title: "Edit Project", 
      project, 
      organizations, 
      errors: null, 
      old: {} 
    });
  } catch (err) {
    console.error("❌ Error loading edit project form:", err);
    res.status(500).render("500", { title: "Server Error", error: err });
  }
}

// ----------------------
// Process edit project form
// ----------------------
async function updateProject(req, res) {
  const errors = validationResult(req);
  const { title, description, location, date, organizationId } = req.body;

  if (!errors.isEmpty()) {
    const organizations = await getAllOrganizations();
    const project = await projectModel.getProjectById(parseInt(req.params.id, 10));
    return res.render("edit-project", { 
      title: "Edit Project", 
      project: { ...project, ...req.body }, 
      organizations, 
      errors: errors.array(), 
      old: req.body 
    });
  }

  try {
    const projectId = await projectModel.updateProject(
      parseInt(req.params.id, 10),
      title,
      description,
      location,
      date,
      parseInt(organizationId, 10)
    );
    req.flash("success", "Project updated successfully!");
    res.redirect(`/projects/${projectId}`);
  } catch (err) {
    console.error("❌ Error updating project:", err);
    req.flash("error", "Failed to update project.");
    res.redirect("/projects");
  }
}

// ----------------------
// Delete project
// ----------------------
async function deleteProject(req, res) {
  try {
    const projectId = parseInt(req.params.id, 10);
    await projectModel.deleteProject(projectId);
    req.flash("success", "Project deleted successfully!");
    res.redirect("/projects");
  } catch (err) {
    console.error("❌ Error deleting project:", err);
    req.flash("error", "Failed to delete project.");
    res.redirect("/projects");
  }
}

// ----------------------
// Export
// ----------------------
export default {
  projectDetail,
  listProjects,
  showNewProjectForm,
  processNewProjectForm,
  showEditProjectForm,
  updateProject,
  deleteProject
};

export { projectValidation };
