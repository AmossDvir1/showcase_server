import { Request, Response } from "express";
import Notification from "../../../models/Notification";
import User, { IUser } from "../../../models/User";

const getNotifications = async (req: Request, res: Response) => {
  const user = req.user as IUser;
  const userId = user._id;
  if (!userId) {
    return res.status(400).json({ message: "No userId sent" });
  }
  try {
    // Fetch notifications for the user
    const notifications = await Notification.find({ recipient: userId })
      .sort("-timestamp")
      .exec();

    
    return res.status(200).json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching notifications" });
  }
};
export { getNotifications };
