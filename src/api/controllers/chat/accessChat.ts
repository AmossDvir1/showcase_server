import { Request, Response } from "express";
import User, { IUser } from "../../../models/User";
import Chat from "../../../models/Chat";
import { Document } from "mongoose";

const accessChat = async (req: Request, res: Response) => {
  const user = req.user as IUser;
  const userId = req.body.userId;
  if (!userId) {
    return res.status(400).json({ message: "No userId sent" });
  }

  let chat = (await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users")
    .populate("latestMessage")) as (Document<unknown, {}, IUser> &
    Omit<IUser & { _id: String }, never>)[];
  chat = await User.populate(chat, {
    path: "latestMessage.sender",
    select: "firstName lastName",
  });
  if (chat.length > 0) {
    return res.json({ chat });
  } else {
    let newChatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [userId, user._id],
    };
    try {
      const createdChat = await Chat.create(newChatData);
      const fullChatData = await createdChat.populate("users");
      return res.json({ chatData: fullChatData });
    } catch (err: any) {
      console.log(err);
      return res
        .status(500)
        .json({ message: "Error occurred during creating new chat" });
    }
  }
};
export { accessChat };
