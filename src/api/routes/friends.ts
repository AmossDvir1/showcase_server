import express from "express";
import { checkAuthentication } from "../utils/authUtils";
import { getRelationship } from "../controllers/relationships/getRelationship";
import { createRelationship } from "../controllers/relationships/createRelationship";
import { confirmRelationship } from "../controllers/relationships/confirmRelationship";
import { getUserFriends } from "../controllers/relationships/getUserFriends";
const relationshipRoute = express.Router();


// -------------------------- //
// ----- GET Functions ------ //
// -------------------------- //

relationshipRoute.get("/", checkAuthentication, getRelationship);
relationshipRoute.get("/friends-list/:userId", checkAuthentication, getUserFriends);
relationshipRoute.get("/friends-list", checkAuthentication, getUserFriends);

// -------------------------- //
// ----- POST Functions ----- //
// -------------------------- //

relationshipRoute.post("/", checkAuthentication, createRelationship);
relationshipRoute.put("/confirm", checkAuthentication, confirmRelationship);


export { relationshipRoute }