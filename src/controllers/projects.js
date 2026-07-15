import * as projectModel from "../models/projects.js";

async function projectDetail(req, res) {
  try {
    const projectId = req.params.id;

    // Fetch project details (with organization info + categories)
    const project = await projectModel.getProjectById(projectId);

    console.log("🔎 projectDetail called with ID:", projectId);
    console.log("➡️ Project data:", project);

    if (!project) {
      return res.status(404).render("404", { 
        title: "Not Found", 
        message: "Project not found" 
      });
    }

    // Pass project directly — it already contains categories
    res.render("project", { 
      title: project.name, 
      project, 
      categories: project.categories 
    });
  } catch (err) {
    console.error("❌ Error in projectDetail:", err);
    res.status(500).render("500", { 
      title: "Server Error", 
      error: err 
    });
  }
}

async function listProjects(req, res) {
  try {
    const projects = await projectModel.getAllProjects();

    console.log("🔎 listProjects called");
    console.log("➡️ Projects data:", projects);

    res.render("projects", { 
      title: "Projects", 
      projects 
    });
  } catch (err) {
    console.error("❌ Error fetching projects:", err);
    res.status(500).render("500", { 
      title: "Server Error", 
      error: err 
    });
  }
}

export default {
  projectDetail,
  listProjects,
};
