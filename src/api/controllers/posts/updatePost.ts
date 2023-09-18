import { Request, Response } from "express";
import { IUser } from "../../../models/User";
import Post, { IPost } from "../../../models/Post";

const updatePost = async (req: Request, res: Response) => {
  const content = req.body.content;
  const user = req?.user as IUser;
  const postId = req.params.id;

  if (!content) {
    console.log("No content sent");
    return res.status(400).json({ message: "No content sent" });
  }

  console.log(`Updating post with ID: ${postId} ...`);

  try {
    // Find the post by ID
    const existingPost = await Post.findOne({ _id: postId });

    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the user is the owner of the post (you may need to adjust this check based on your authentication logic)
    if (existingPost.userId.toString() !== user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to update this post" });
    }

    // Update the post content
    existingPost.content = content;
    const updatedPost = await existingPost.save();

    return res.status(200).json({
      message: "Post updated successfully",
      postData: { postId: updatedPost._id, content: updatedPost.content },
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: "Error while updating the post" });
  }
};

export { updatePost };