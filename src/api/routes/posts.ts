import express from "express";
import { checkAuthentication } from "../utils/authUtils";
import { createPost } from "../controllers/posts/createPost";
import { getMyPosts } from "../controllers/posts/getPosts";
const postRoute = express.Router();

// -------------------------- //
// ----- GET Functions ------ //
// -------------------------- //

postRoute.get("/me", checkAuthentication, getMyPosts);

// -------------------------- //
// ----- POST Functions ----- //
// -------------------------- //
postRoute.post("/create", checkAuthentication, createPost);

export { postRoute };
