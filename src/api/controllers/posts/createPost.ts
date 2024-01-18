import { Request, Response } from "express";

import { IUser } from "../../../models/User";
import Post, { IPost } from "../../../models/Post";

const createPost = async (req: Request, res: Response) => {
  const content = req?.body?.content;
  const user = req?.user as IUser;
  if (!content) {
    console.log("No content sent");
    return res.status(400).json({ message: "No content sent" });
  }
  console.log(`Creating post with content: ${content} ...`);
  try {
    // Create a new post
    const newPost: IPost = new Post({
      content,
      likes:[],
      comments:[],
      userId:user._id
    });
    const savedPost = await newPost.save();
    return res.status(201).json({ message: "Post created successfully", postData: {postId: savedPost._id, content: savedPost.content} });


  } catch (err: any) {
    console.error(err);
    return res.status(500).json({message: "Error while posting"});
  }
};
export { createPost };
