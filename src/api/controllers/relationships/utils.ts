import { getUserFriendsIds } from "./getUserFriendsIds";

const areUsersFriends = async (user1Id: string, user2Id: string): Promise<boolean> => {
    try {
      const user1FriendsIds = await getUserFriendsIds(user1Id);
      return user1FriendsIds.includes(user2Id);
    } catch (err: any) {
      console.error(err);
      return false;
    }
  };

  export { areUsersFriends }