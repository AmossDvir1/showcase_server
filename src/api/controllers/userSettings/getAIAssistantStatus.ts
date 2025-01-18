import { Request, Response } from "express";
import UserSettings from "../../../models/UserSettings";
import { IUser } from "../../../models/User";

const getAIAssistantStatus = async (req: Request, res: Response) => {
  const userId = (req?.user as IUser)?.id;

  try {
    // Find the user's settings and select only the `usingAIAssistant` field
    const userSettings = await UserSettings.findOne(
      { userId },
      { "general.usingAIAssistant": 1, _id: 0 }
    );

    if (!userSettings) {
      return res.status(404).json({ error: "User settings not found" });
    }

    // Return the AI assistant status
    res.json({ usingAIAssistant: userSettings.general.usingAIAssistant });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve AI Assistant status" });
  }
};

export { getAIAssistantStatus };