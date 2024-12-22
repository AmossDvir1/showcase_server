import express from "express";
import { checkAuthentication } from "../utils/authUtils";
import { getChatPreviews } from "../controllers/chats/getChatPreviews";
const chatRoute = express.Router();


// -------------------------- //
// ----- GET Functions ------ //
// -------------------------- //

chatRoute.get("/previews", checkAuthentication, getChatPreviews);


// -------------------------- //
// ----- POST Functions ----- //
// -------------------------- //


export { chatRoute }