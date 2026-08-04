import express from "express";
import { requireLogin } from "../controllers/users.js";
import * as volunteerController from "../controllers/volunteers.js";

const router = express.Router();

router.post("/projects/:id/volunteer", requireLogin, volunteerController.volunteerForProject);
router.post("/projects/:id/unvolunteer", requireLogin, volunteerController.removeVolunteerFromProject);

export default router;
