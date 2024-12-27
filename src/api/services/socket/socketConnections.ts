import { Socket } from "socket.io";
import { io } from "../../..";
import { IUser } from "../../../models/User";
import { broadcastToUser } from "./broadcast";
interface SocketConnections {
  [userId: string]: {
    socketId: string; // Socket ID
    sessionId: string; // Session ID
  }[]; // Each user can have multiple socket connections (e.g., for multiple devices)
}

const socketConnections: SocketConnections = {};

export const addSocketConnection = (
  userId: string,
  socketId: string,
  sessionId: string
) => {
  if (!socketConnections[userId]) {
    // Initialize the array if it doesn't exist
    socketConnections[userId] = [];
  }
  // Add the new socketId to the array
  socketConnections[userId].push({ socketId, sessionId });
};

// Remove a socket connection for a user
export const removeSocketConnection = (
  socket: Socket,
  onlineFriends: IUser[]
) => {
  for (const userId in socketConnections) {
    // Find the connection to remove
    const connectionIndex = socketConnections[userId].findIndex(
      (conn) => conn.socketId === socket.id
    );
    if (connectionIndex !== -1) {
      socketConnections[userId].splice(connectionIndex, 1); // Remove the socket connection

      // If the user has no more connections, delete the entry
      if (socketConnections[userId].length === 0) {
        delete socketConnections[userId];
      }
      break; // Exit once the socket is found and removed
    }
  }

  // Notify the user's friends that they are offline
  onlineFriends.forEach((friend) => {
    const dataToBroadcast = {
      id: socket.user,
    };
    broadcastToUser(dataToBroadcast, friend.id, "friendOffline");
  });
};

// Get all socketIds for a user (can be multiple if user has multiple devices/tabs open)
export const getAllSocketIdsByUserId = (userId: string): string[] => {
  return socketConnections[userId]?.map((conn) => conn.socketId) || [];
};

export const getSocketByUserId = (userId: string, sessionId: string) => {
  const connections = socketConnections[userId]; // Get the array of socket connections

  // Find the first connection matching the sessionId
  const matchingConnection = connections.find(
    (conn) => conn.sessionId === sessionId
  );
  return matchingConnection
    ? io.sockets.sockets.get(matchingConnection.socketId)
    : null;
};

// Get all socket objects by userId or a single socket by sessionId
export const getAllSocketsByUserId = (userId: string) => {
  const connections = socketConnections[userId]; // Get the array of socket connections
  if (!connections || connections.length === 0) return null; // Return null if no connections

  // Return all sockets if no sessionId is provided
  return connections
    .map((conn) => io.sockets.sockets.get(conn.socketId))
    .filter(Boolean);
};

export default socketConnections;
