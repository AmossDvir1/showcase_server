import { io } from "../../..";
import { getSocketIdByUserId } from "./socketConnections";

const broadcast = (data: {} | [], userId: string, eventName: string) => {
  const socketId = getSocketIdByUserId(userId);
  io.to(socketId).emit(eventName, data);
};

export default broadcast;
