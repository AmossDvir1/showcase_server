
type NotificationType = "friend_request" | "like" | "comment";
type NotificationState = "read" | "unread";
type ImagePurpose = "profile" | "cover";

// types/socket.d.ts
import { Socket } from "socket.io";
import { IUser } from "./models/User";

declare module "socket.io" {
  export interface Socket {
    user?: IUser; // Adjust `any` to the actual user type if known, e.g., `User`
  }
}

export {NotificationType, NotificationState, ImagePurpose}