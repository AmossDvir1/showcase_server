import { Request, Response } from "express";
import { IUser } from "../../../models/User";
import Post from "../../../models/Post";
// import { MUUID } from "uuid-mongodb";
const MUUID = require("uuid-mongodb");

const getMyPosts = async (req: Request, res: Response) => {
  const user = req?.user as IUser;
  try {
    const userId = MUUID.from(user._id).toString();
    const myPosts = await Post.find({ userId });
    return res.status(200).json({ posts: myPosts });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Failed to retrieve posts" });
  }
};

export { getMyPosts };
