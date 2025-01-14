import express from "express";
import { checkAuthentication } from "../utils/authUtils";
import { aiSuggestionsController  } from "../controllers/aiController/aiController";

const aiRoute = express.Router();


// -------------------------- //
// ----- GET Functions ------ //
// -------------------------- //



// -------------------------- //
// ----- POST Functions ----- //
// -------------------------- //

aiRoute.post("/suggestions", checkAuthentication, aiSuggestionsController);

export { aiRoute }