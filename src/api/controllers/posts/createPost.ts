import { Request, Response } from "express";

import { IUser } from "../../../models/User";

const createPost = async (req: Request, res: Response) => {
  const content = req?.body?.content;
  const user = req?.user as IUser;
  if (!content) {
    console.log("No content sent");
    return res.status(400).json({ message: "No content sent" });
  }
  return res.status(201).json({message: "Post created successfully"});
};
export { createPost };
