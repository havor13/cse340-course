// src/controllers/organizations.js
import * as organizationModel from "../models/organizations.js";
import * as projectModel from "../models/projects.js";

async function listOrganizations(req, res) {
  try {
    const organizations = await organizationModel.getAllOrganizations();

    console.log("🔎 listOrganizations called");
    console.log("➡️ Organizations data:", organizations);

    res.render("organizations", { 
      title: "Organizations", 
      organizations 
    });
  } catch (err) {
    console.error("❌ Error fetching organizations:", err.message);
    res.status(500).render("500", { 
      title: "Server Error", 
      error: err.message   // pass error message to view
    });
  }
}

async function organizationDetail(req, res) {
  try {
    const organizationId = req.params.id;

    const organization = await organizationModel.getOrganizationById(organizationId);
    const projects = await projectModel.getProjectsByOrganizationId(organizationId);

    console.log("🔎 organizationDetail called with ID:", organizationId);
    console.log("➡️ Organization data:", organization);
    console.log("➡️ Projects data:", projects);

    if (!organization) {
      return res.status(404).render("404", { 
        title: "Not Found", 
        message: "Organization not found" 
      });
    }

    res.render("organization", { 
      title: organization.name, 
      organization, 
      projects 
    });
  } catch (err) {
    console.error("❌ Error in organizationDetail:", err.message);
    res.status(500).render("500", { 
      title: "Server Error", 
      error: err.message   // pass error message to view
    });
  }
}

export default {
  listOrganizations,
  organizationDetail,
};
