import { Request, Response } from "express";
import UserSettings from "../../../models/UserSettings";
import { IUser } from "../../../models/User";
import { createDefaultSettings } from "./createDefaultSettings";

const getMyUserSettings = async (req: Request, res: Response) => {
  const userId = (req?.user as IUser)?.id;
  try {
    let  settings = await UserSettings.findOne({ userId }).populate("profile.technologies");
    if (!settings) {
      settings = await createDefaultSettings(userId);
    }
    res.json({settings});
  } catch (error: any) {
    res.status(500).json({ error });
  }
};

export { getMyUserSettings };
