import { Request, Response } from "express";
import { IUser } from "../../../models/User";
import Post from "../../../models/Post";

const deletePost = async (req: Request, res: Response) => {
  const user = req?.user as IUser;
  const postId = req.params.id;
  console.log(`deleting post with postId: ${postId}` );
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({ message: "Post not found" });
    }
    if (post.user.userId !== user._id){
        return res.status(403).json({ message: "Unauthorized" });
    }

    await post.deleteOne();
    console.log('Post successfully deleted');
    res.json({message: 'Post successfully deleted'});
  } catch (err: any) {
    console.error(err);
    res.status(500).json({message: "Failed to delete post"})
  }
};

export { deletePost };
