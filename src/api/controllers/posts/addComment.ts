import { Request, Response } from "express";
import { IUser } from "../../../models/User";
import Post from "../../../models/Post";
import { v4 as uuidv4 } from "uuid";
import { ObjectId } from "mongodb";

const addComment = async (req: Request, res: Response) => {
  const user = req?.user as IUser;
  const postId = req.params.id;
  const content = req?.body?.content ?? "";
  if (content === "" || !content) {
    return res.status(400).json({ message: "No value inserted" });
  }
  console.log(
    `commenting on post with postId: ${postId} with string: ${content}}`
  );
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({ message: "Post not found" });
    }
    const newComment = {
      content,
      likes: [],
      user: { userId: user._id, userStr: `${user.firstName} ${user.lastName}`, urlMapping: user.urlMapping },
      _id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    post.comments.push(newComment);

    // Save the updated post
    await post.save();
    return res.status(200).json({ postData: post });
  } catch (err: any) {
    console.error("Error liking/disliking post:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export { addComment };
