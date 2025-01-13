import { Request, Response } from "express";
import { IUser } from "../../../models/User";
import { getUserFriendsIds } from "../relationships/getUserFriendsIds";
import getUsersByIds from "../users/getUsersByIds";
import UserSettings from "../../../models/UserSettings";


const getRoomUsers = async (req: Request, res: Response) => {
  const { techId } = req.params;
  const user = req.user as IUser;
  const userId = user?.id;

  if(!techId || !userId) {
    return res.status(400).json({ message: 'Missing required parameters.' });
  }

  try {
      // Get friend IDs of the current user
      const friendIds = await getUserFriendsIds(userId);
      if (!friendIds || friendIds.length === 0) {
        return res.json({ users: [] });
      }

      // Find all friends
      const friends = await getUsersByIds(friendIds);
       // Populate profile pictures for all friends
       const populatedUsers = await Promise.all(
        friends.map(async (user) => {
            await user.populate("profilePicture");
            return user;
        })
    );

      // Fetch user settings for all friends and filter by technology ID
      const filteredFriends = await Promise.all(populatedUsers.map(async (friend) => {
           const userSettings = await UserSettings.findOne({ userId: friend.id });
            if (userSettings) {
                return  userSettings.profile?.technologies?.some(
                    (tech: string) => tech.toString() === techId
                  ) ? friend : null
            }
            return null
        }))
        const validUsers = filteredFriends.filter(friend=> friend !== null) as IUser[]
        
     return res.json({ users: validUsers });


  } catch (error: any) {
    console.error("Error fetching users by technology:", error);
    return res.status(500).json({ message: "Error fetching users in the room." });
  }
};

export { getRoomUsers };