import { Request, Response } from "express";
import { IUser } from "../../../models/User";
import Session from "../../../models/Session";

export const removeUserSession = async (req: Request, res: Response) => {
  const user = req.user as IUser;
  const sessionId = req?.body?.sessionId; // The ID of the session to be removed
  if (!sessionId) {
    return res.status(400).json({ message: "No sessionId sent." });
  }
  try {
    const session = await Session.findOne({ _id: sessionId, userId: user.id });
    if (!session) {
      return res.status(404).json({ message: "Session not found." });
    }

    await session.deleteOne(); // Remove the session
    res.status(200).json({ message: "Session removed successfully." });
  } catch (err) {
    console.error("Error removing session:", err);
    res.status(500).json({ message: "Failed to remove session." });
  }
};
