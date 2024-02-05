import express from "express";
import { checkAuthentication } from "../utils/authUtils";
import { getProfile } from "../controllers/profiles/getProfile";
import { uploadProfilePicture } from "../controllers/profiles/uploadProfilePicture";
const profileRoute = express.Router();


// -------------------------- //
// ----- GET Functions ------ //
// -------------------------- //

profileRoute.get("/", checkAuthentication, getProfile);

// -------------------------- //
// ----- POST Functions ----- //
// -------------------------- //

profileRoute.post("/upload/profile-picture", checkAuthentication, uploadProfilePicture);

export { profileRoute }