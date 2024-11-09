import { Request, Response } from "express";
import User, { IUser } from "../../../models/User";
import Chat from "../../../models/Chat";

const getChats = async (req: Request, res: Response) => {
  const user = req.user as IUser;

  try {
    const chat = await Chat.find({ users: { $elemMatch: { $eq: user._id } } })
      .populate("users")
      .populate("groupAdmin")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });
      const chatData = await User.populate(chat, {path: "latestMessage.sender", select: "firstName lastName"});
    return res.json({ chatData });
  } catch (err: any) {
    console.log(err);
    return res.status(500).json({ message: "Unable to fetch chats" });
  }
};

export { getChats };
