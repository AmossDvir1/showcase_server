import express from "express";
import { checkAuthentication } from "../utils/authUtils";
import { createPost } from "../controllers/posts/createPost";
import { getMyPosts } from "../controllers/posts/getPosts";
import { deletePost } from "../controllers/posts/deletePost";
import { updatePost } from "../controllers/posts/updatePost";
import { likePost } from "../controllers/posts/likePost";
import { addComment } from "../controllers/posts/addComment";
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
// ---- UPDATE Functions ---- //
// -------------------------- //

postRoute.put("/:id", checkAuthentication, updatePost);
postRoute.put("/like/:id", checkAuthentication, likePost);
postRoute.put("/comment/:id", checkAuthentication, addComment);


// -------------------------- //
// ---- DELETE Functions ---- //
// -------------------------- //
postRoute.delete("/:id", checkAuthentication, deletePost);


export { postRoute };
