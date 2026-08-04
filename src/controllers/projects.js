// src/controllers/projects.js
import { body, validationResult } from "express-validator";
import * as projectModel from "../models/projects.js";
import { getAllOrganizations } from "../models/organizations.js";
import { getAllCategories, getCategoriesByProjectId, updateProjectCategories } from "../models/categories.js";
import * as volunteerModel from "../models/volunteers.js"; // ✅ import volunteer model

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
  body("project_date")
    .notEmpty().withMessage("Date is required")
    .isISO8601().withMessage("Date must be a valid date format"),
  body("organizationId")
    .notEmpty().withMessage("Organization is required")
    .isInt().withMessage("Organization must be a valid integer")
];

// ----------------------
// Project detail (with volunteer check)
// ----------------------
async function projectDetail(req, res) {
  try {
    const projectId = parseInt(req.params.id, 10);
    const project = await projectModel.getProjectById(projectId);

    if (!project) {
      return res.status(404).render("404", { title: "Not Found", message: "Project not found" });
    }

    let isVolunteer = false;
    if (req.session.user) {
      isVolunteer = await volunteerModel.isVolunteer(req.session.user.user_id, projectId);
    }

    res.render("project", {
      title: project.title,
      project,
      categories: project.categories,
      isVolunteer,
      user: req.session.user,
      errors: []
    });
  } catch (err) {
    console.error("❌ Error in projectDetail:", err);
    res.status(500).render("500", { title: "Server Error", error: err });
  }
}

// ----------------------
// Volunteer controllers
// ----------------------
async function volunteerForProject(req, res) {
  try {
    const userId = req.session.user.user_id;
    const projectId = parseInt(req.params.id, 10);
    await volunteerModel.addVolunteer(userId, projectId);
    req.flash("success", "You are now volunteering for this project!");
    res.redirect(`/projects/${projectId}`);
  } catch (err) {
    console.error("❌ Error volunteering:", err);
    req.flash("error", "Failed to volunteer for project.");
    res.redirect(`/projects/${req.params.id}`);
  }
}

async function unvolunteerFromProject(req, res) {
  try {
    const userId = req.session.user.user_id;
    const projectId = parseInt(req.params.id, 10);
    await volunteerModel.removeVolunteer(userId, projectId);
    req.flash("success", "You have been removed as a volunteer.");
    res.redirect(`/projects/${projectId}`);
  } catch (err) {
    console.error("❌ Error removing volunteer:", err);
    req.flash("error", "Failed to remove volunteer.");
    res.redirect(`/projects/${req.params.id}`);
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
      errors: [], 
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
  const { title, description, location, project_date, organizationId } = req.body;

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
    const newProject = await projectModel.createProject(
      title,
      description,
      location,
      project_date,
      parseInt(organizationId, 10)
    );

    if (!newProject || !newProject.project_id) {
      req.flash("error", "Failed to create project.");
      return res.redirect("/projects/new");
    }

    req.flash("success", "Project created successfully!");
    return res.redirect(`/projects/${newProject.project_id}`);
  } catch (err) {
    console.error("❌ Error creating project:", err);
    req.flash("error", "Database error: " + err.message);
    return res.redirect("/projects/new");
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

    if (project.project_date instanceof Date) {
      project.project_date = project.project_date.toISOString().split("T")[0];
    }

    res.render("edit-project", { 
      title: "Edit Project", 
      project, 
      organizations, 
      errors: [], 
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
async function processEditProjectForm(req, res) {
  const errors = validationResult(req);
  const { title, description, location, project_date, organizationId } = req.body;

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
    const updatedProject = await projectModel.updateProject(
      parseInt(req.params.id, 10),
      title,
      description,
      location,
      project_date,
      parseInt(organizationId, 10)
    );

    if (!updatedProject) throw new Error("Project update failed");

    req.flash("success", "Project updated successfully!");
    return res.redirect(`/projects/${updatedProject.project_id}`);
  } catch (err) {
    console.error("❌ Error updating project:", err);
    req.flash("error", "Failed to update project.");
    return res.redirect("/projects");
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
// Assign categories
// ----------------------
async function showAssignCategoriesForm(req, res) {
  try {
    const projectId = parseInt(req.params.id, 10);
    const project = await projectModel.getProjectById(projectId);
    const categories = await getAllCategories();
    const assignedCategories = await getCategoriesByProjectId(projectId);

    if (!project) {
      return res.status(404).render("404", { title: "Not Found", message: "Project not found" });
    }

    res.render("assign-categories", {
      title: "Assign Categories",
      project,
      categories,
      assignedCategories,
      errors: []
    });
  } catch (err) {
    console.error("❌ Error loading assign categories form:", err);
    res.status(500).render("500", { title: "Server Error", error: err });
  }
}

async function processAssignCategoriesForm(req, res) {
  try {
    const projectId = parseInt(req.params.id, 10);
    const categoryIds = Array.isArray(req.body.categoryIds)
      ? req.body.categoryIds.map(id => parseInt(id, 10))
      : [];

    await updateProjectCategories(projectId, categoryIds);

    req.flash("success", "Categories updated successfully!");
    res.redirect(`/projects/${projectId}`);
  } catch (err) {
    console.error("❌ Error updating categories:", err);
    req.flash("error", "Failed to update categories.");
    res.redirect(`/projects/${req.params.id}`);
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
  processEditProjectForm,
  deleteProject,
  showAssignCategoriesForm,
  processAssignCategoriesForm,
  volunteerForProject,       // ✅ new
  unvolunteerFromProject     // ✅ new
};

export { projectValidation };
