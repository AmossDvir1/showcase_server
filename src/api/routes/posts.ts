import express from "express";
import { checkAuthentication } from "../utils/authUtils";
import { createPost } from "../controllers/posts/createPost";
const postRoute = express.Router();


// -------------------------- //
// ----- GET Functions ------ //
// -------------------------- //

postRoute.get("/", checkAuthentication, );

// -------------------------- //
// ----- POST Functions ----- //
// -------------------------- //
postRoute.post("/create", checkAuthentication, createPost);

export { postRoute }