import express from "express";
import { checkAuthentication } from "../utils/authUtils";
import { getRoomUsers } from "../controllers/rooms/roomController";
const roomRoute = express.Router();


// -------------------------- //
// ----- GET Functions ------ //
// -------------------------- //

roomRoute.get("/:techId/users", checkAuthentication, getRoomUsers);


export { roomRoute }