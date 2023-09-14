import { Request, Response } from "express";
import { IUser } from "../../../models/User";
import Post from "../../../models/Post";

const getMyPosts = async (req: Request, res: Response) => {
  const user = req?.user as IUser;
  try {
    const myPosts = await Post.find({ userId: user._id });
    const postsData = myPosts.map((post) => ({
      postId: post._id,
      isExposed: post.isExposed,
      userId: post.userId,
      content: post.content,
    }));
    return res.status(200).json({ posts: postsData });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Failed to retrieve posts" });
  }
};

export { getMyPosts };
