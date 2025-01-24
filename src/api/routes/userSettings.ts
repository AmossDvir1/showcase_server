import express from "express";
import { checkAuthentication } from "../utils/authUtils";
import { getUserSettings } from "../controllers/userSettings/getUserSettings ";
import { updateUserSettings } from "../controllers/userSettings/updateUserSettings";
import { getMyUserSettings } from "../controllers/userSettings/getMyUserSettings";
import { updateMyUserSettings } from "../controllers/userSettings/updateMyUserSettings";
import { updateAIAssistant } from "../controllers/userSettings/updateAIAssistant";
import { getAIAssistantStatus } from "../controllers/userSettings/getAIAssistantStatus";
import { getCountries } from "../controllers/userSettings/getCountries";
import { getStatesByCountry } from "../controllers/userSettings/getStatesByCountry";
import { getCitiesByStatesAndCountries } from "../controllers/userSettings/getCitiesByStatesAndCountries";

const userSettingsRoute = express.Router();

userSettingsRoute.get("/ai", checkAuthentication, getAIAssistantStatus);
userSettingsRoute.get("/:userId", checkAuthentication, getUserSettings);
userSettingsRoute.get("/", checkAuthentication, getMyUserSettings);
userSettingsRoute.get("/geo/countries", checkAuthentication, getCountries);
userSettingsRoute.get("/geo/states/:countryId", checkAuthentication, getStatesByCountry);
userSettingsRoute.get("/geo/cities/:countryId/:stateId", checkAuthentication, getCitiesByStatesAndCountries);

userSettingsRoute.post("/ai", checkAuthentication, updateAIAssistant);
userSettingsRoute.put("/:userId", checkAuthentication, updateUserSettings);
userSettingsRoute.put("/", checkAuthentication, updateMyUserSettings);

export { userSettingsRoute };
