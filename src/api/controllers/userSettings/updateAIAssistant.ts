import { Request, Response } from "express";
import { IUser } from "../../../models/User";
import UserSettings, { IUserSettings } from "../../../models/UserSettings";

const updateAIAssistant = async (req: Request, res: Response) => {
  const userId = (req?.user as IUser)?.id;
  const { usingAIAssistant } = req?.body?.data; // Extract only the required property
  
  if (usingAIAssistant === undefined) {
    return res.status(400).json({ error: "usingAIAssistant is required" });
  }
  try {
    const updatedSettings = await UserSettings.findOneAndUpdate(
      { userId }, // Match the document by userId
      { $set: { "general.usingAIAssistant": usingAIAssistant } }, // Update only this field
      { new: true, upsert: true } // Return the updated document, create if not exists
    );

    if (!updatedSettings) {
      return res.status(404).json({ error: "User settings not found" });
    }

    res.json({updated: true});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update AI Assistant settings" });
  }
};

export { updateAIAssistant };
