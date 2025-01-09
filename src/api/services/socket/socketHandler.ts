import { Server, Socket } from "socket.io";
import websocketAuth from "../../../middlewares/websocketAuth";
import {
  addSocketConnection,
  removeSocketConnection,
} from "./socketConnections";
import { getOnlineFriendsSockets } from "./retrieveOnlineFriends";
import User, { IUser } from "../../../models/User";
import { sendMessage, getConversation, typing } from "./chatEventHandler";
import { broadcastToUser } from "./broadcast";
import { getPastChatsForUser } from "../../controllers/chats/getPastChats";
import { getOtherParticipantId } from "../../controllers/chats/getOtherParticipantId";

export const initializeSocket = (io: Server) => {
  io.use(websocketAuth);

  io.on("connection", async (socket: Socket) => {
    console.log("A user connected", socket.user?.username);

    // Add the socket to the centralized connection store
    addSocketConnection(socket.user?.id, socket.id, socket.sessionId ?? "");
    socket.emit("connectionConfirmed", { message: "Connection established!" });

        // Fetch and emit online friends to the user
        const onlineFriends = await getOnlineFriendsSockets(socket.user?.id);

        // Fetch past conversations
        const pastConversations = await getPastChatsForUser(socket.user?.id);
    
        // Combine online friends and past conversations to get unique participants
        const uniqueChats = new Map<string, IUser>();
    
        // Add online friends to the unique list
        onlineFriends.forEach((friend: IUser) => {
          uniqueChats.set(friend.id, friend);
        });
    
        // Add past conversations to the unique list, ensuring no duplicate
        for (const conv of pastConversations) {
          const friendId = getOtherParticipantId(conv, socket.user?.id); // Get the other participant's ID in the conversation
    
          // If the friend is not already in the uniqueChats map, add them
          if (!uniqueChats.has(friendId)) {
            uniqueChats.set(friendId, { id: friendId } as IUser); // Only store the ID for fast access
          }
        }

    socket.emit("conversations", Array.from(uniqueChats.values()));

    // Notify the user's friends that they are online
    onlineFriends.forEach(async (friend: IUser) => {
      // await socket.user?.populate("profilePicture");
      const dataToBroadcast = {
        id: socket.user?.id,
      };
      broadcastToUser(dataToBroadcast, friend.id, "friendOnline");
    });

    // Handle sendMessage event
    socket.on("sendMessage", async (data) => {
      await sendMessage(socket, data);
    });

    // Handle start typing event
    socket.on("typing", async (data) => {
      await typing(socket, data);
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
