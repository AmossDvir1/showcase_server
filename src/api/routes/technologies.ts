import express from "express";
import { checkAuthentication } from "../utils/authUtils";
import { getTechnologiesInventory } from "../controllers/technologies/getTechnologiesInventory";
import { getTechnology } from "../controllers/technologies/getTechnology";

const technologiesRoute = express.Router();

technologiesRoute.get(
  "/inventory",
  checkAuthentication,
  getTechnologiesInventory
);

technologiesRoute.get(
  "/",
  checkAuthentication,
  getTechnology
);

export { technologiesRoute };
