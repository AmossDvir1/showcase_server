import { Request, Response } from "express";
import Notification from "../../../models/Notification";
import { IUser } from "../../../models/User";

const markNotificationsAsRead = async (req: Request, res: Response) => {
  const user = req.user as IUser;
  const userId = user._id;
  const notificationsIds = req?.body?.data?.ids
  console.log(notificationsIds, userId);
  if (!notificationsIds || notificationsIds.length === 0) {
    return res.status(400).json({ message: "No notifications sent" });
  }

  try {
    const bulkNotifs = notificationsIds.map((notifId:string) => {
        return {
          updateOne: {
            filter: {
              _id: notifId
            },
            update: {
              status: "read"
            }
          }
        }
      })
    const updated = await Notification.bulkWrite(bulkNotifs);

    return res.json({ message: `${updated.matchedCount} Notifications marked as read`, ids: notificationsIds });
  } catch (error) {
    console.error("Error marking notifications as read: ", error);
    res.status(500).json({ error: " Error marking notifications as read" });
  }
};
export { markNotificationsAsRead };
