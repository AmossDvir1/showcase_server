import { Socket } from "socket.io";
import { io } from "../../..";
import { IUser } from "../../../models/User";
interface SocketConnections {
  [userId: string]: string; // Mapping user ID to socket ID
}

const socketConnections: SocketConnections = {};

export const addSocketConnection = (userId: string, socketId: string) => {
  socketConnections[userId] = socketId;
};

export const removeSocketConnection = (socket: Socket, onlineFriends:IUser[]) => {
  for (const userId in socketConnections) {
    if (socketConnections[userId] === socket.id) {
      delete socketConnections[userId];
    }
  }

  // Notify the user's friends that they are offline
  onlineFriends.forEach((friend) => {
    const friendSocketId = getSocketIdByUserId(friend.id);
    if (friendSocketId) {
      io.to(friendSocketId).emit("friendOffline", {
        friendOffline: socket.user,
      });
    }
  });
};

export const getSocketIdByUserId = (userId: string) => {
  return socketConnections[userId];
};

export const getSocketByUserId = (userId: string) => {
    return io.sockets?.sockets?.get(socketConnections[userId]);
    
  };

export default socketConnections;
