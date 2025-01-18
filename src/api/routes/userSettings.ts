import express from "express";
import { checkAuthentication } from "../utils/authUtils";
import { getUserSettings } from "../controllers/userSettings/getUserSettings ";
import { updateUserSettings } from "../controllers/userSettings/updateUserSettings";
import { getMyUserSettings } from "../controllers/userSettings/getMyUserSettings";
import { updateMyUserSettings } from "../controllers/userSettings/updateMyUserSettings";
import { updateAIAssistant } from "../controllers/userSettings/updateAIAssistant";
import { getAIAssistantStatus } from "../controllers/userSettings/getAIAssistantStatus";

const userSettingsRoute = express.Router();

userSettingsRoute.get("/ai", checkAuthentication, getAIAssistantStatus);
userSettingsRoute.get("/:userId", checkAuthentication, getUserSettings);
userSettingsRoute.get("/", checkAuthentication, getMyUserSettings);

userSettingsRoute.post("/ai", checkAuthentication, updateAIAssistant);
userSettingsRoute.put("/:userId", checkAuthentication, updateUserSettings);
userSettingsRoute.put("/", checkAuthentication, updateMyUserSettings);

export { userSettingsRoute };
