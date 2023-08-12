import express from "express";
import { checkAuthentication } from "../utils/authUtils";
import { getSearchSuggestions } from "../controllers/search/getSearchSuggestions";
const searchRoute = express.Router();


// -------------------------- //
// ----- GET Functions ------ //
// -------------------------- //

searchRoute.get("/suggestions", checkAuthentication, getSearchSuggestions);


// -------------------------- //
// ----- POST Functions ----- //
// -------------------------- //


export { searchRoute }