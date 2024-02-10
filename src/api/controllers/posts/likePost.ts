import { Request, Response } from "express";
import { IUser } from "../../../models/User";
import Post from "../../../models/Post";
import notificationService from "../../services/notifications/notificationService";
import { generateContent } from "../../services/notifications/generateContent";
import { mapPostContent, populatePosts } from "../../../utils/utils";

const likePost = async (req: Request, res: Response) => {
  const user = req?.user as IUser;
  const postId = req.params.id;
  
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({ message: "Post not found" });
    }
    // Check if the user has already liked the post
    const hasLiked = post.likes.includes(user._id);

    // If the user has liked the post, remove the like; otherwise, add the like
    if (hasLiked) {
      console.log(`Disliking post with postId: ${postId}`);
      // Remove the user's _id from the likes array
      post.likes = (post.likes as string[]).filter((userId) => userId !== user._id);
    } else {
      console.log(`Liking post with postId: ${postId}`);
      // Add the user's _id to the likes array
      post.likes.push(user._id);
      
      // Add notification to the user who wrote the post
      const notif = await notificationService.createNotification(
        user._id,
        post.user,
        "like",
        await generateContent("like", user._id, post.user)
      );
      if (!notif) {
        console.error(
          `Failed to create a friend request notification from userId ${post.user} to ${user._id}`
        );
      }
    }

    // Save the updated post
    await post.save();
    await populatePosts(post);
    const mappedPost = await mapPostContent(post);

    return res
      .status(200)
      .json({
        message: `Post ${hasLiked ? "disliked" : "liked"} successfully`,
        postData: mappedPost.postsData[0], media: mappedPost.media
      });
  } catch (err: any) {
    console.error("Error liking/disliking post:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export { likePost };
