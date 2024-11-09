import { getUserFriendsIds } from "../../controllers/relationships/getUserFriendsIds";
import getUsersByIds from "../../controllers/users/getUsersByIds";
import socketConnections from "./socketConnections";

export const getOnlineFriendsSockets = async (userId: string) => {
  const friends = await getUserFriendsIds(userId);
  if (!friends) return [];
  const onlineFriendsIds = friends.filter(
    (friendId: string) => socketConnections[friendId]
  );

  const onlineFriends = await getUsersByIds(onlineFriendsIds);
  return onlineFriends;
};
