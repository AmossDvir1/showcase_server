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
    // const notifications = Notification.find({userId});
    const bulkNotifs = notificationsIds.map((notifId:string) => {
        return {
          updateOne: {
            filter: {
              _id: notifId
            },
            // If you were using the MongoDB driver directly, you'd need to do
            // `update: { $set: { field: ... } }` but mongoose adds $set for you
            update: {
              status: "read"
            }
          }
        }
      })
    console.log(bulkNotifs);
    const updated = await Notification.bulkWrite(bulkNotifs);
    console.log(updated);

    return res.json({ message: `${updated.matchedCount} Notifications marked as read`, ids: notificationsIds });
  } catch (error) {
    console.error("Error marking notifications as read: ", error);
    res.status(500).json({ error: " Error marking notifications as read" });
  }
};
export { markNotificationsAsRead };
