import { Document, Schema, model } from "mongoose";
import { NotificationState, NotificationType } from "../global";
import { v4 as uuidv4 } from "uuid";

// Define an interface for the Notification document
export interface INotification extends Document {
  sender: string; // Assuming sender is a user ID
  recipient: string; // Assuming recipient is a user ID
  content: string;
  type: NotificationType; // Add other notification types as needed
  timestamp: Date;
  _id: string;
  status: NotificationState;
  extraData: string;
}

// Define the Notification Schema
const notificationSchema = new Schema<INotification>({
  sender: {
    type: String,
    ref: "User", // Reference to the User model
    required: true,
  },
  recipient: {
    type: String,
    ref: "User", // Reference to the User model
    required: true,
  },
  content: {
    type: String,
    // required: true,
  },
  _id: {
    type: String,
    required: true,
    default: uuidv4,
  },
  type: {
    type: String,
    required: true,
    enum: ["friend_request", "post", "like"], // Add other notification types as needed
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: "unread",
    enum: ["unread", "read"],
  },
  extraData: {
    type: String,
    default: "",
  },
});

export default model<INotification>("Notification", notificationSchema);
