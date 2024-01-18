import { Request, Response } from "express";
import { IUser } from "../../../models/User";
import Post from "../../../models/Post";
import notificationService from "../../services/notifications/notificationService";
import { generateContent } from "../../services/notifications/generateContent";

const addComment = async (req: Request, res: Response) => {
  const user = req?.user as IUser;
  const postId = req.params.id;
  const commentStr = req?.body?.commentStr ?? "";
  if (commentStr === "" || !commentStr) {
    return res.status(400).json({ message: "No value inserted" });
  }
  console.log(
    `commenting on post with postId: ${postId} with string: ${commentStr}}`
  );
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({ message: "Post not found" });
    }
    post.comments.push({commentStr, id:user._id});

    // Save the updated post
    await post.save();
    return res.status(200).json();
  } catch (err: any) {
    console.error("Error liking/disliking post:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export { addComment };
