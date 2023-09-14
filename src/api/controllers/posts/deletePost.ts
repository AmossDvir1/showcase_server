import { Request, Response } from "express";
import { IUser } from "../../../models/User";
import Post from "../../../models/Post";

const deletePost = async (req: Request, res: Response) => {
  const user = req?.user as IUser;
  const postId = req.params.id;
  console.log(postId);
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({ message: "Post not found" });
    }
    if (post.userId !== user._id){
        return res.status(403).json({ message: "Unauthorized" });
    }

    post.deleteOne();
  } catch (err: any) {
    res.status(500).json({message: "Failed to delete post"})
  }
};

export { deletePost };
