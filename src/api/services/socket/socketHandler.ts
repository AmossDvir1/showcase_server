import { Server, Socket } from "socket.io";
import websocketAuth from "../../../middlewares/websocketAuth";
import {
  addSocketConnection,
  removeSocketConnection,
} from "./socketConnections";
import { getOnlineFriendsSockets } from "./retrieveOnlineFriends";
import { IUser } from "../../../models/User";
import { sendMessage, getConversation } from "./chatEventHandler";
import { broadcastToUser } from "./broadcast";

export const initializeSocket = (io: Server) => {
  io.use(websocketAuth);

  io.on("connection", async (socket: Socket) => {
    console.log("A user connected", socket.user?.username);

    // Add the socket to the centralized connection store
    addSocketConnection(socket.user?.id, socket.id, socket.sessionId ?? "");
    socket.emit("connectionConfirmed", { message: "Connection established!" });

    // Fetch and emit online friends to the user
    const onlineFriends = await getOnlineFriendsSockets(socket.user?.id);
    socket.emit("onlineFriends", onlineFriends);

    // Notify the user's friends that they are online
    onlineFriends.forEach(async (friend: IUser) => {
      await socket.user?.populate("profilePicture");
      const dataToBroadcast = {
        friendOnline: socket.user,
      };
      broadcastToUser(dataToBroadcast, friend.id, "friendOnline");
    });

    // Handle sendMessage event
    socket.on("sendMessage", async (data) => {
      await sendMessage(socket, data);
    });

    // Handle getConversation event
    socket.on("getConversation", async (data) => {
      await getConversation(socket, data);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.user?.username);

      // Remove the socket from the centralized store
      removeSocketConnection(socket, onlineFriends);
    });
  });
};
