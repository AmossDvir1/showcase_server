import express from "express";
import { checkAuthentication } from "../utils/authUtils";
import { getUserSettings } from "../controllers/userSettings/getUserSettings ";
import { updateUserSettings } from "../controllers/userSettings/updateUserSettings";
import { getMyUserSettings } from "../controllers/userSettings/getMyUserSettings";
import { updateMyUserSettings } from "../controllers/userSettings/updateMyUserSettings";

const userSettingsRoute = express.Router();

userSettingsRoute.get("/:userId", checkAuthentication, getUserSettings);
userSettingsRoute.get("/", checkAuthentication, getMyUserSettings);

userSettingsRoute.put("/:userId", checkAuthentication, updateUserSettings);
userSettingsRoute.put("/", checkAuthentication, updateMyUserSettings);

export { userSettingsRoute };
