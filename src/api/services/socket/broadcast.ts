import { io } from "../../..";
import { getAllSocketIdsByUserId, getSocketByUserId } from "./socketConnections";

const broadcastToUser = (data: {} | [], userId: string, eventName: string) => {
  const socketIds = getAllSocketIdsByUserId(userId);
  socketIds.forEach((socketId) => {
    io.to(socketId).emit(eventName, data);
  });
};
const broadcastToSession = (data: {} | [], userId: string, sessionId: string, eventName: string) => {
  const socket = getSocketByUserId(userId, sessionId);
  if(socket){
    socket.emit(eventName, data);}
};

export {broadcastToUser, broadcastToSession};
