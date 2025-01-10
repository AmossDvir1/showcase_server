import { Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import jwt from "jsonwebtoken";
import { IUser } from "../models/User";
import UserModel from "../models/User"; // Assuming you have a UserModel to interact with the database

// Define a custom interface for the socket to include the `user` property
interface IAuthenticatedSocket extends Socket {
  user?: IUser; // Adjust `any` to the actual type of your user object if known
  sessionId?: string; // Adding sessionId to the socket
}

// Define the middleware function
const websocketAuth = async (socket: IAuthenticatedSocket, next: (err?: ExtendedError) => void) => {
    const accessToken = socket?.handshake?.auth?.token;
    const sessionId = socket.handshake.auth?.sessionId; // Session ID from handshake

  if (!accessToken || !sessionId) {
    return next(new Error("Authentication error"));
  }

  try {
    // Verify the JWT token using your access token secret
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET as string);
    // Assuming the decoded token contains a `userId`
    if (typeof decoded !== "object" || !decoded?.id) {
      return next(new Error("Invalid token payload"));
    }

    // Fetch the full user from the database using the `userId` from the token
    const user = await UserModel.findById(decoded.id).exec();
    if (!user) {
      return next(new Error("User not found"));
    }

    // Attach the full user data to the socket object
    socket.user = user;
    socket.sessionId = sessionId ?? ""; 
    next();
  } catch (error) {
    // Emit an event to the client to handle token refresh
    socket.emit("authError", { message: "Authentication failed, please refresh your token." });
    next(new Error("Authentication error")); // Ends the connection
  }
};

export default websocketAuth;
