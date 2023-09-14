import express from "express";
import { checkAuthentication } from "../utils/authUtils";
import { createPost } from "../controllers/posts/createPost";
import { getMyPosts } from "../controllers/posts/getPosts";
import { deletePost } from "../controllers/posts/deletePost";
const postRoute = express.Router();

// -------------------------- //
// ----- GET Functions ------ //
// -------------------------- //

postRoute.get("/me", checkAuthentication, getMyPosts);

// -------------------------- //
// ----- POST Functions ----- //
// -------------------------- //
postRoute.post("/create", checkAuthentication, createPost);

// -------------------------- //
// ---- DELETE Functions ---- //
// -------------------------- //
postRoute.delete("/:id", checkAuthentication, deletePost);


export { postRoute };
