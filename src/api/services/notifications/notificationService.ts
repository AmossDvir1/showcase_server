import { NotificationContent } from "../../../global";
import Notification, { INotification } from "../../../models/Notification";
import { User } from "../../../models/models";

class NotificationService {
  // Function to create a new notification
  async createNotification(
    senderId: string,
    recipientId: string,
    type: NotificationContent,
    content?: string
  ): Promise<boolean | INotification> {
    let extraData = "";
    const sender = await User.findById(senderId);
    switch (type) {
      case "friendRequest":
        if (!sender) {
          return false;
        }
        extraData = sender.urlMapping.toString();
        break;
      case "likePost":
        break;
        
    }

    const notification = new Notification({
      sender: senderId,
      recipient: recipientId,
      content: content ?? "",
      type,
      extraData,
    });

    const savedNotification = await notification.save();
    return savedNotification;
  }

  // Function to fetch notifications for a user
  async fetchNotificationsForUser(userId: string): Promise<INotification[]> {
    try {
      // Use Mongoose to query the notifications for the user
      const notifications = await Notification.find({ recipient: userId })
        .sort({ timestamp: -1 }) // Sort by timestamp in descending order (latest first)
        .exec();

      return notifications;
    } catch (error: any) {
      throw new Error(
        "Error fetching notifications for user: " + error.message
      );
    }
  }

  // Function to mark notifications as read for a user
  async markAsRead(notificationIds: string | string[]): Promise<void> {
    try {
      const idsToMarkAsRead = Array.isArray(notificationIds)
        ? notificationIds
        : [notificationIds]; // Ensure we have an array of IDs

      // Update the notifications with the provided IDs to mark them as "read"
      await Notification.updateMany(
        { _id: { $in: idsToMarkAsRead } },
        { $set: { status: "read" } }
      ).exec();
    } catch (error: any) {
      throw new Error("Error marking notifications as read: " + error.message);
    }
  }
}

export default new NotificationService();
