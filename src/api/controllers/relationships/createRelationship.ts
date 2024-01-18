import { Request, Response } from "express";
import User, { IUser } from "../../../models/User";
import Relationship from "../../../models/Relationship";
import notificationService from "../../services/notifications/notificationService";
import { generateContent } from "../../services/notifications/generateContent";

const createRelationship = async (req: Request, res: Response) => {
  const user = req.user as IUser;
  const userAId = user?._id;
  const username = req.body.addUsername;
  try {
    // Find User B's ID based on the provided username
    const userB = await User.findOne({ username });

    if (!userB) {
      return res.status(400).json({ message: "User not found." });
    }

    const userBId = userB._id;

    // Check if a relationship already exists
    const existingRelationship = await Relationship.findOne({
      $or: [
        { user_first_id: userAId, user_second_id: userBId },
        { user_first_id: userBId, user_second_id: userAId },
      ],
    });

    if (existingRelationship) {
      return res.status(400).json({ message: "Relationship already exists." });
    }

    // Create a new relationship
    const newRelationship = new Relationship({
      user_first_id: userAId,
      user_second_id: userB._id,
      relState: "pending_first_second",
    });

    await newRelationship.save();
    const notif = await notificationService.createNotification(
      userAId,
      userB._id,
      "friend_request",
      await generateContent("friend_request", userAId, userB._id)
    );
    if (!notif) {
      console.error(
        `Failed to create a friend request notification from userId ${userB._id} to ${userAId}`
      );
    }

    res
      .status(201)
      .json({ relationship: "request_sent", message: "Friend request sent." });
  } catch (error) {
    console.error("Error sending friend request:", error);
    res.status(500).json({ message: "Error sending friend request." });
  }
};

export { createRelationship };
