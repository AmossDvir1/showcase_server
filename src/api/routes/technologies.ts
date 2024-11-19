import express from "express";
import { getUserTechnologies } from "../controllers/technologies/getUserTechnologies ";
import { checkAuthentication } from "../utils/authUtils";
import { updateUserTechnologies } from "../controllers/technologies/updateUserTechnologies";
import { getTechnologiesInventory } from "../controllers/technologies/getTechnologiesInventory";

const technologiesRoute = express.Router();

technologiesRoute.get("/", checkAuthentication, getUserTechnologies);
technologiesRoute.get("/inventory", checkAuthentication, getTechnologiesInventory);
technologiesRoute.put("/", checkAuthentication, updateUserTechnologies);

export { technologiesRoute };
