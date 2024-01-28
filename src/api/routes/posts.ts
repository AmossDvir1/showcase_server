import express from "express";
import { checkAuthentication } from "../utils/authUtils";
import { createPost } from "../controllers/posts/createPost";
import { getMyPosts, getUserPosts } from "../controllers/posts/getPosts";
import { deletePost } from "../controllers/posts/deletePost";
import { updatePost } from "../controllers/posts/updatePost";
import { likePost } from "../controllers/posts/likePost";
import { addComment } from "../controllers/posts/addComment";
import { likeComment } from "../controllers/posts/likeComment";
const postRoute = express.Router();

// -------------------------- //
// ----- GET Functions ------ //
// -------------------------- //

postRoute.get("/posts/me", checkAuthentication, getMyPosts);
postRoute.get("/posts/user/:profileId", checkAuthentication, getUserPosts);

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
postRoute.put("/like/:postId/:commentId", checkAuthentication, likeComment);


// -------------------------- //
// ---- DELETE Functions ---- //
// -------------------------- //
postRoute.delete("/:id", checkAuthentication, deletePost);


export { postRoute };
