import { Request, Response } from "express";
import ChatModel from "../../../models/Chat";
import { IUser } from "../../../models/User";
import { getOnlineFriendsIds } from "../../services/socket/retrieveOnlineFriends";

const getChatPreviews = async (req: Request, res: Response) => {
  try {
    const user = req?.user as IUser;
    const userId = user?._id;

    const onlineFriendsIds = await getOnlineFriendsIds(userId);

    const lastMessages = await Promise.all(
      onlineFriendsIds.map(async (friendId) => {
        const chat = await ChatModel.findOne({
          participants: { $all: [friendId, userId] },
        })
          .sort({ "messages.createdAt": -1 })
          .limit(1);
        const lastMessage = chat?.lastMessage?.text;
        const lastMessageAt = chat?.lastMessage?.createdAt;

        return {
          friendId,
          lastMessageContent: lastMessage || null,
          lastMessageAt: lastMessageAt || null,
        };
      })
    );
    return res.json({ lastMessages });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch last messages" });
  }
};

export { getChatPreviews };
