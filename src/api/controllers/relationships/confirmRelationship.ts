import { Request, Response } from "express";
import User, { IUser } from "../../../models/User";
import Relationship from "../../../models/Relationship";

const confirmRelationship = async (req: Request, res: Response) => {
  const user = req.user as IUser;
  const userAId = user?._id;
  const senderId = req.body.senderId;

  try {
    const sender = await User.findById(senderId);
    if (!sender) {
      return res.status(400).json({ message: "User not found" });
    }
    // Check if a relationship between userA and userB exists with the state "pending_second_first"
    const existingRelationship = await Relationship.findOne({
      $or: [
        {
          user_first_id: userAId,
          user_second_id: senderId,
          relState: "pending_second_first",
        },
        {
          user_first_id: senderId,
          user_second_id: userAId,
          relState: "pending_first_second",
        },
      ],
    });
    if (!existingRelationship) {
      return res
        .status(400)
        .json({
          message:
            "No friend request found and therefore no relationship confirmed",
        });
    }

    // Update the relationship status to "friends"
    existingRelationship.relState = "friends";
    await existingRelationship.save();
    return res.status(200).json({ message: "Relationship updated to friends" });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { confirmRelationship };
