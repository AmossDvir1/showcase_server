import { Request, Response } from "express";
import { IUser } from "../../../models/User";
import Post from "../../../models/Post";
import { v4 as uuidv4 } from "uuid";
import { mapPostContent, populatePosts } from "../../../utils/utils";
import notificationService from "../../services/notifications/notificationService";
import { generateContent } from "../../services/notifications/generateContent";
import broadcast from "../../services/socket/broadcast";

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
      user: user._id,
      _id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    post.comments.push(newComment);

    // Save the updated post
    await post.save();

    // Add notification to the user who wrote the comment
    const notif = await notificationService.createNotification(
      user._id,
      post?.user,
      "comment",
      await generateContent("comment", user._id, post.user)
    );
    if (!notif) {
      console.error(
        `Failed to create a comment notification from userId ${post.user} to ${user._id}`
      );
    }
    broadcast(notif, post?.user, "newNotification");

    await populatePosts(post);
    const mappedPost = await mapPostContent(post);

    return res
      .status(200)
      .json({ postData: mappedPost.postsData[0], media: mappedPost.media });
  } catch (err: any) {
    console.error("Error while adding comment:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export { addComment };
