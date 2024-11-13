import { Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import jwt from "jsonwebtoken";
import { IUser } from "../models/User";
import UserModel from "../models/User"; // Assuming you have a UserModel to interact with the database

// Define a custom interface for the socket to include the `user` property
interface AuthenticatedSocket extends Socket {
  user?: IUser; // Adjust `any` to the actual type of your user object if known
}

// Define the middleware function
const websocketAuth = async (socket: AuthenticatedSocket, next: (err?: ExtendedError) => void) => {
    const token = socket?.handshake?.auth?.token;

  if (!token) {
    return next(new Error("Authentication error"));
  }

  try {
    // Verify the JWT token using your access token secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
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
    next();
  } catch (error) {
    console.log(error)
    next(new Error("Authentication error"));
  }
};

export default websocketAuth;
