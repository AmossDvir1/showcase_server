import { NotificationType } from "../../../global";
import User, { IUser } from "../../../models/User";

const generateContent = async (
  type: NotificationType,
  senderId: string,
  recipientId: string
) => {
  let content = "";
  try {
    const sender = await User.findById(senderId);
    switch (type) {
      case "friend_request":
        content = `${sender?.firstName} ${sender?.lastName} sent you a friend request`;
        break;
      case "comment":
        content = `${sender?.firstName} ${sender?.lastName} commented on your post`;
        break;
      case "like":
        content = `${sender?.firstName} ${sender?.lastName} liked your post`;
        break;
      default:
        break;
    }
  } catch (err: any) {
    console.log(err);
  }
  return content;
};

export { generateContent };
