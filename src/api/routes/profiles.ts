import express from "express";
import { checkAuthentication } from "../utils/authUtils";
import { getProfile } from "../controllers/profiles/getProfile";
const profileRoute = express.Router();


// -------------------------- //
// ----- GET Functions ------ //
// -------------------------- //

profileRoute.get("/:id", checkAuthentication, getProfile);

// -------------------------- //
// ----- POST Functions ----- //
// -------------------------- //

export { profileRoute }