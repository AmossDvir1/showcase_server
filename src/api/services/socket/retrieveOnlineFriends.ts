import { IUser } from "../../../models/User";
import { getUserFriendsIds } from "../../controllers/relationships/getUserFriendsIds";
import getUsersByIds from "../../controllers/users/getUsersByIds";
import socketConnections from "./socketConnections";

export const getOnlineFriendsSockets = async (userId: string) => {
  const friends = await getUserFriendsIds(userId);
  if (!friends) return [];
  const onlineFriendsIds = friends.filter(
    (friendId: string) => socketConnections[friendId]
  );

  let onlineFriends: any = await getUsersByIds(onlineFriendsIds);
  onlineFriends = await Promise.all(
    onlineFriends.map(async (friend: IUser) => {
      await friend.populate("profilePicture");
      return friend;
    })
  );
  return onlineFriends;
};
