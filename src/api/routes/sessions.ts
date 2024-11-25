import express from "express";
import { checkAuthentication } from "../utils/authUtils";
import { getUserSessions } from "../controllers/sessions/getUserSessions";
import { removeUserSession } from "../controllers/sessions/removeUserSession";
const sessionsRoute = express.Router();


// -------------------------- //
// ----- GET Functions ------ //
// -------------------------- //

sessionsRoute.get("/", checkAuthentication, getUserSessions);
sessionsRoute.post("/remove", checkAuthentication, removeUserSession);


// -------------------------- //
// ----- POST Functions ----- //
// -------------------------- //


export { sessionsRoute }