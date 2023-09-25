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
    // const sendersIds = notifications.map((notif) => notif.sender);
    // const senders = await User.find({
    //   _id: {
    //     $in: sendersIds,
    //   },
    // });

    // let notificationsData = notifications.map((notif) => {
    //   let extraData: String | undefined;
    //   switch (notif.type) {
    //     case "friend_request":
    //       extraData = senderData?.urlMapping;
    //       break;

    //     default:
    //       break;
    //   }
    //   notificationsData.map((notif) => ({ ...notif, extraData }));
    // });

    return res.status(200).json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching notifications" });
  }
};
export { getNotifications };
