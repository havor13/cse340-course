// src/controllers/volunteers.js
import * as volunteerModel from "../models/volunteers.js";

/**
 * Add the current user as a volunteer for a project
 */
export async function volunteerForProject(req, res) {
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

/**
 * Remove the current user from a project’s volunteers
 */
export async function removeVolunteerFromProject(req, res) {
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
