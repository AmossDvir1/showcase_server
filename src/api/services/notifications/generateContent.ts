import { NotificationContent } from "../../../global";
import User from "../../../models/User";

const generateContent = async (
  type: NotificationContent,
  senderId: string,
  recipientId: string
) => {
  let content = "";
  try {
    const sender = await User.findById(senderId);
    switch (type) {
      case "friendRequest":
        content = `${sender?.firstName} ${sender?.lastName} sent you a friend request`;
        break;
      case "likeComment":
        content = `${sender?.firstName} ${sender?.lastName} liked your comment`;
        break;
      case "likePost":
        content = `${sender?.firstName} ${sender?.lastName} liked your post`;
        break;
      case "comment":
        content = `${sender?.firstName} ${sender?.lastName} commented on your post`;
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
