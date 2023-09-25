import { Request, Response } from "express";
import User, { IUser } from "../../../models/User";
import Relationship from "../../../models/Relationship";

const getRelationship = async (req: Request, res: Response) => {
  const user = req.user as IUser;
  const userAId = user?._id;

  const data = req?.body;
  if (!data) {
    return res.sendStatus(400);
  }
  const username = req?.query["addUsername"];

  try {
    // Find User B's ID based on the provided username
    const userB = await User.findOne({ username });

    if (!userB) {
      return res.status(404).json({ message: "User not found." });
    }

    const userBId = userB._id;
    const existingRelationship = await Relationship.findOne({
      $or: [
        { user_first_id: userAId, user_second_id: userBId },
        { user_first_id: userBId, user_second_id: userAId },
      ],
    });

    if (existingRelationship?.relState) {
      if (existingRelationship.relState === "friends") {
        return res
        .status(200)
        .json({ relationship: existingRelationship.relState });
      }
      // User A (the current user) requested from user B:
      else if (existingRelationship.user_first_id === userAId) {
        console.log(user.username + " pending " + userB.username);
        return res
          .status(200)
          .json({ relationship: "request_sent" });
      }
      // User B requested from user A (the current user):
      else if (existingRelationship.user_first_id === userBId) {
        console.log(userB.username + " pending " + user.username);
        return res
          .status(200)
          .json({ relationship: "pending_approval" });
      }
      return res
        .status(200)
        .json({ relationship: existingRelationship.relState });
    } else {
      return res.status(200).json({ relationship: "no_relationship" });
    }
  } catch (err: any) {}
  // Check if a relationship already exists
};

export { getRelationship };
