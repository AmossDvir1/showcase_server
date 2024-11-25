import { Request, Response } from "express";
import Session from "../../../models/Session";
import { IUser } from "../../../models/User";

export const getUserSessions = async (req: Request, res: Response) => {
  const user = req.user as IUser;
  const currentSessionId = req.sessionId; // Assuming req.sessionId contains the current session's ID

  try {
    const sessions = await Session.find({ userId: user.id }).select(
      "device location _id createdAt"
    );

    // Map over sessions and add the `currentSession` field
    const sessionsWithCurrentSession = sessions.map((session) => ({
      ...session.toObject(),
      currentSession: session._id === currentSessionId, // Add the currentSession field
    }));

    res.status(200).json({ sessions: sessionsWithCurrentSession });
  } catch (err) {
    console.error("Error fetching user sessions:", err);
    res.status(500).json({ message: "Failed to fetch sessions." });
  }
};
