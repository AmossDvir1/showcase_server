import { Request, Response } from "express";
import { IUser } from "../../../models/User";
import Session from "../../../models/Session";
import {
  getSocketByUserId,
  removeSocketConnection,
} from "../../services/socket/socketConnections";
import { getOnlineFriendsSockets } from "../../services/socket/retrieveOnlineFriends";

const logoutUser = async (req: Request, res: Response) => {
  const user = req.user as IUser;
  try {
    const sessionId = req?.sessionId;
    const deletedSession = await Session.findOneAndDelete({
      userId: user._id,
      _id: sessionId,
    });
    if (sessionId){
      // Remove socket and broadcast it to all connected friends:
      const socket = getSocketByUserId(user.id, sessionId);
      if (socket) {
        // Remove the socket from the centralized store
        const onlineFriends = await getOnlineFriendsSockets(socket.user?.id);
        removeSocketConnection(socket, onlineFriends);
      }
    }

    return res.json({ message: "user is logged out" });
  } catch (err: any) {
    console.log("Error during logging out: ", err);
  }
};

export { logoutUser };
