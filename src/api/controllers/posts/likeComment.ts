import { Request, Response } from "express";
import { IUser } from "../../../models/User";
import Post from "../../../models/Post";
import notificationService from "../../services/notifications/notificationService";
import { generateContent } from "../../services/notifications/generateContent";
import { mapPostContent, populatePosts } from "../../../utils/utils";

const likeComment = async (req: Request, res: Response) => {
  const user = req?.user as IUser;
  const postId = req.params.postId;
  const commentId = req.params.commentId;

  console.log(`liking comment with postId: ${postId}, commentId: ${commentId}`);

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({ message: "Post not found" });
    }

    const comment = post.comments.find((comment) => comment._id.toString() === commentId);

    if (!comment) {
      return res.status(400).json({ message: "Comment not found" });
    }

    // Check if the user has already liked the comment
    const hasLiked = comment.likes.includes(user._id);

    // If the user has liked the comment, remove the like; otherwise, add the like
    if (hasLiked) {
      // Remove the user's _id from the likes array
      comment.likes = comment.likes.filter((userId) => userId !== user._id);
    } else {
      // Add the user's _id to the likes array
      comment.likes.push(user._id);

      // Add notification to the user who wrote the comment
      const notif = await notificationService.createNotification(
        user._id,
        comment.user,
        "like",
        await generateContent("like", user._id, comment.user)
      );
      if (!notif) {
        console.error(
          `Failed to create a like notification from userId ${comment.user} to ${user._id}`
        );
      }
    }

    // Save the updated post
    await post.save();
    await populatePosts(post);
    // const mappedPost = mapPostContent(post);
    

    return res.status(200).json({
      message: `Comment ${hasLiked ? "disliked" : "liked"} successfully`,
      commentData: comment,
    });
  } catch (err: any) {
    console.error("Error liking/disliking comment:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export { likeComment };