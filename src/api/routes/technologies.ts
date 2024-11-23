import express from "express";
import { checkAuthentication } from "../utils/authUtils";
import { getTechnologiesInventory } from "../controllers/technologiesInventory/getTechnologiesInventory";

const technologiesRoute = express.Router();

technologiesRoute.get(
  "/inventory",
  checkAuthentication,
  getTechnologiesInventory
);

export { technologiesRoute };
