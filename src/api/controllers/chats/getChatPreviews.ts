import { Request, Response } from "express";
import ChatModel from "../../../models/Chat";
import { IUser } from "../../../models/User";
import { getOnlineFriendsIds } from "../../services/socket/retrieveOnlineFriends";
import { getPastChatsForUser } from "./getPastChats";
import { getOtherParticipantId } from "./getOtherParticipantId";
import { findUserById } from "../../services/findUser";

const getChatPreviews = async (req: Request, res: Response) => {
  const user = req?.user as IUser;
  const userId = user?._id;

  try {
    const onlineFriendsIds = await getOnlineFriendsIds(userId);

    const fetchFriendDetails = async (
      friendId: string,
      isOnline: boolean,
      chat: any
    ) => {
      let friendDetails = await findUserById(friendId);
      friendDetails = await friendDetails?.populate("profilePicture");

      return {
        isOnline,
        friendId,
        chatId: chat?._id,
        friendDetails,
        lastMessage: chat?.lastMessage,
      };
    };

    const onlinePreviews = await Promise.all(
      onlineFriendsIds.map(async (friendId) => {
        const chat = await ChatModel.findOne({
          participants: { $all: [friendId, userId] },
        });
        return fetchFriendDetails(friendId, true, chat);
      })
    );

    const pastChats = await getPastChatsForUser(userId);
    const onlineChatIds = new Set(
      onlinePreviews.map((onlineChat) => onlineChat.chatId)
    );

    const pastChatsPreviews = await Promise.all(
      pastChats
        .filter((pastChat) => !onlineChatIds.has(pastChat._id))
        .map(async (pastChat) => {
          const friendId = getOtherParticipantId(pastChat, userId);
          return fetchFriendDetails(friendId, false, pastChat);
        })
    );

    const mergedChats = [...pastChatsPreviews, ...onlinePreviews];

    return res.json({ previews: mergedChats });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch last messages" });
  }
};

export { getChatPreviews };
