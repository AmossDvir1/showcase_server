import { Request, Response } from "express";
import User, { IUser } from "../../../models/User";
import { getUserFriendsIds } from "./getUserFriendsIds";

const getUserFriends = async (req: Request, res: Response) => {
  const me = req?.user as IUser;
  const userId = req.params.userId;
  try {
    const friendsIds = await getUserFriendsIds(userId ?? me._id);
    const friends = await User.find({
      _id: { $in: friendsIds },
    });
    res.json({friends});
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Failed to get friends" });
  }
};

export { getUserFriends };
