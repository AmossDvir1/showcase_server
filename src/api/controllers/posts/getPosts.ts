import { Request, Response } from "express";
import User, { IUser } from "../../../models/User";
import Post from "../../../models/Post";
import { getFriendsPosts } from "./getFriendsPosts";
import {
  mapPostContent,
  populatePosts,
} from "../../../utils/utils";

const getMyPosts = async (req: Request, res: Response) => {
  const user = req?.user as IUser;
  try {
    const friendsPosts = await getFriendsPosts(user._id);
    let myPosts = await Post.find({ user: user._id });
    await populatePosts(myPosts);
    

    const allPosts = myPosts.concat(friendsPosts)
      .sort((a, b) => Number(b.updatedAt) - Number(a.updatedAt));
    
    let mappedPosts = await mapPostContent(allPosts);
    const postsData = await Promise.all(
      allPosts.map(async (post) => {
        const writer = await User.findById(post.user);
        return {
          _id: post._id,
          liked: (post.likes as IUser[]).some((like) => like._id === user._id),
          likes: post.likes,
          comments: post.comments,
          isExposed: post.isExposed,
          user: post.user,
          content: post.content,
          createdAt: post.createdAt,
        };
      })
    );
    mappedPosts = {...mappedPosts, postsData: postsData}
    return res.status(200).json({ posts: mappedPosts });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Failed to retrieve posts" });
  }
};

const getUserPosts = async (req: Request, res: Response) => {
  const user = req?.user as IUser;
  const profileId = req.params.profileId;

  try {
    const posts = await Post.find({ user: profileId });
    await populatePosts(posts);
    let mappedPosts = await mapPostContent(posts);
    const postsData = posts.map((post) => {
      return {
        _id: post._id,
        liked: post?.likes?.includes(user._id),
        likes: post.likes,
        comments: post.comments,
        isExposed: post.isExposed,
        user: post.user,
        content: post.content,
        createdAt: post.createdAt,
      };
    });

    mappedPosts = {...mappedPosts, postsData }
    return res.status(200).json({ posts: mappedPosts });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Failed to retrieve posts" });
  }
};

export { getMyPosts, getUserPosts };
