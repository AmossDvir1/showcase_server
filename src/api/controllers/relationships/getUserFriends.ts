import { Request, Response } from "express";
import { IUser } from "../../../models/User";
import { User } from "../../../models/models";
import { getUserFriendsIds } from "./getUserFriendsIds";

const getUserFriends = async (req: Request, res: Response) => {
  const me = req?.user as IUser;
  const userId = req.params.userId;
  try {
    const friendsIds = await getUserFriendsIds(userId ?? me._id);
    const friends = await User.find({
      _id: { $in: friendsIds },
    })
    .select("username firstName lastName email urlMapping profilePicture") // Include only required fields
    .populate("profilePicture").exec();
  
    return res.json({friends});
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Failed to get friends" });
  }
};

export { getUserFriends };
