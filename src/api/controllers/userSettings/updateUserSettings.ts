import { Request, Response } from "express";
import UserSettings, { IUserSettings } from "../../../models/UserSettings";

const updateUserSettings = async (req: Request, res: Response) => {
  const userId = req?.params?.userId;
  const updates: Partial<IUserSettings> = req?.body?.data; // Use Partial for type-safe updates

  try {
    const updatedSettings = await UserSettings.findOneAndUpdate(
      { userId },
      { $set: updates },
      { new: true, upsert: true } // Create if not exists
    );

    res.json(updatedSettings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
};

const updateUserSettingsPartial = async (req: Request, res: Response) => {
  const userId = req.params?.userId;
  const field = req?.body?.data?.field;
  const value = req?.body?.data?.value;

  if (!field) {
    res.status(400).json({ message: "Field name is required." });
    return;
  }

  try {
    const updateKey = `profile.${field}`; // Dynamically generate the field path
    const updatedSettings = await UserSettings.findOneAndUpdate(
      { userId },
      { $set: { [updateKey]: value } }, // Use computed key for field update
      { new: true }
    );

    if (!updatedSettings) {
      res.status(404).json({ message: "Settings not found" });
      return;
    }

    res.json(updatedSettings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
};

export { updateUserSettings, updateUserSettingsPartial };
