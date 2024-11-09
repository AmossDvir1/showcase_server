import express from "express";
import { checkAuthentication } from "../utils/authUtils";
import { accessChat } from "../controllers/chat/accessChat";


const chatRoute = express.Router();

// -------------------------- //
// ----- GET Functions ------ //
// -------------------------- //

chatRoute.get("/", checkAuthentication, );

// -------------------------- //
// ----- POST Functions ----- //
// -------------------------- //

chatRoute.post("/", checkAuthentication, accessChat);
// chatRoute.post("/", checkAuthentication, );


export { chatRoute };
