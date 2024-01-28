import { Request, Response } from "express";
import User, { IUser } from "../../../models/User";
import Post from "../../../models/Post";
import { getFriendsPosts } from "./getFriendsPosts";

const getMyPosts = async (req: Request, res: Response) => {
  const user = req?.user as IUser;
  try {
    const friendsPosts = await getFriendsPosts(user._id);
    const myPosts = await Post.find({ "user.userId": user._id });
    const allPosts = myPosts
      .concat(friendsPosts)
      .sort((a, b) => Number(b.updatedAt) - Number(a.updatedAt));
    const postsData = await Promise.all(
      allPosts.map(async (post) => {
        const writer = await User.findById(post.user.userId);
        return {
          _id: post._id,
          liked: post.likes.includes(user._id),
          likes: post.likes,
          comments: post.comments,
          isExposed: post.isExposed,
          user: post.user,
          content: post.content,
          createdAt: post.createdAt,
        };
      })
    );

    return res.status(200).json({ posts: postsData });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Failed to retrieve posts" });
  }
};

const getUserPosts = async (req: Request, res: Response) => {
  const user = req?.user as IUser;

  const profileId = req.params.profileId;

  try {
    const posts = await Post.find({ "user.userId": profileId });
    const postsData = posts.map(post =>{
      return {_id: post._id,
      liked: post.likes.includes(user._id),
      likes: post.likes,
      comments: post.comments,
      isExposed: post.isExposed,
      user: post.user,
      content: post.content,
      createdAt: post.createdAt}
    });
    return res.status(200).json({ postsData });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Failed to retrieve posts" });
  }
};

export { getMyPosts, getUserPosts };
