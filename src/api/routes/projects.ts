import express from "express";
import { createProject } from "../controllers/projects/createProject";
import { getMyProjects, getProjectPreviews } from "../controllers/projects/getProjects";
import { checkAuthentication } from "../utils/authUtils";
const projectRoute = express.Router();


// -------------------------- //
// ----- GET Functions ------ //
// -------------------------- //

projectRoute.get("/me", getMyProjects);
projectRoute.get("/projects_previews", getProjectPreviews);

// -------------------------- //
// ----- POST Functions ----- //
// -------------------------- //

projectRoute.post("/create_post", checkAuthentication, createProject);

export { projectRoute }