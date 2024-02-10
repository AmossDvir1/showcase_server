import express from "express";
import { checkAuthentication } from "../utils/authUtils";
import { getSearchSuggestions } from "../controllers/search/getSearchSuggestions";
import { getSearchResults } from "../controllers/search/getSearchResults";
const searchRoute = express.Router();


// -------------------------- //
// ----- GET Functions ------ //
// -------------------------- //

searchRoute.get("/suggestions", checkAuthentication, getSearchSuggestions);
searchRoute.get("/results", checkAuthentication, getSearchResults);


// -------------------------- //
// ----- POST Functions ----- //
// -------------------------- //


export { searchRoute }