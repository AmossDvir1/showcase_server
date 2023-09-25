import { io, userSocketMap } from "../..";

const sendNotification = (userId: string, message: string) => {
  // Send a notification to a specific user or broadcast to all connected clients
  console.log(userId + " sends notification");
  const socketId = getUserSocket(userId);
  if (socketId) {
    io.to(socketId).emit("notification", message);
  }
};

// Function to get a user's socket by their ID
const getUserSocket = (userId: string): string | undefined => {
  const userSocket = userSocketMap.get(userId);
  return userSocket?.id;
};

export { sendNotification };
