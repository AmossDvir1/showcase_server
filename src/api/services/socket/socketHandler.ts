import { Server, Socket } from "socket.io";
import websocketAuth from "../../../middlewares/websocketAuth";
import { addSocketConnection, getSocketIdByUserId, removeSocketConnection } from "./socketConnections";
import { getOnlineFriendsSockets } from "./retrieveOnlineFriends";

export const initializeSocket = (io: Server) => {
  io.use(websocketAuth);

  io.on("connection", async (socket: Socket) => {
    console.log("A user connected", socket.user?.username);

    // Add the socket to the centralized connection store
    addSocketConnection(socket.user?.id, socket.id);
    socket.emit("connectionConfirmed", { message: "Connection established!" });

    // Fetch and emit online friends to the user
    const onlineFriends = await getOnlineFriendsSockets(socket.user?.id);
    socket.emit("onlineFriends", onlineFriends);

    // Notify the user's friends that they are online
    onlineFriends.forEach((friend) => {
      const friendSocketId = getSocketIdByUserId(friend.id);
      if (friendSocketId) {
        io.to(friendSocketId).emit("friendOnline", { friendOnline: socket.user });
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.user?.username);

      // Remove the socket from the centralized store
      removeSocketConnection(socket, onlineFriends);


    });
  });
};
