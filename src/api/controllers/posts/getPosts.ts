import { Request, Response } from "express";
import User, { IUser } from "../../../models/User";
import Post from "../../../models/Post";
import { getUserFriends } from "../relationships/getUserFriends";
import { getFriendsPosts } from "./getFriendsPosts";

const getMyPosts = async (req: Request, res: Response) => {
  const user = req?.user as IUser;
  try {
    const friendsPosts = await getFriendsPosts(user._id);
    const myPosts = await Post.find({ userId: user._id });
    const allPosts = myPosts
      .concat(friendsPosts)
      .sort((a, b) => Number(b.updatedAt) - Number(a.updatedAt));
    const postsData = await Promise.all(
      allPosts.map(async (post) => {
        const writer = await User.findById(post.userId);
        return {
          postId: post._id,
          liked: post.likes.includes(user._id),
          likes: post.likes,
          comments: post.comments,
          isExposed: post.isExposed,
          user: {
            userId: post.userId,
            fullName: `${writer?.firstName} ${writer?.lastName}`,
          },
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

export { getMyPosts };
