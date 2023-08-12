import { IUser } from "../../models/User";
import { ISession } from "./../../models/Session";

// Creates a new session
export const createUserSession = async (user: IUser, newSession: ISession) => {
  try {
    const savedSession = await newSession.save();
    console.log("Session saved successfully:", savedSession);
    return savedSession;
  } catch (error: any) {
    if (error.code === 11000) {
      console.error("Error: A session with the same userId already exists.");
    } else {
      console.error("Error saving session:", error);
    }
    return false;
  }
};
