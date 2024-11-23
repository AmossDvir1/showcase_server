import { Request, Response } from "express";
import UserSettings from "../../../models/UserSettings";


const getUserSettings = async (req: Request, res: Response) => {
  const userId = req?.params?.userId;
  try {
    const settings = await UserSettings.findOne({ userId });
    if (!settings) {
      res.status(404).json({ message: "Settings not found" });
      return;
    }
    res.json(settings);
  } catch (error: any) {
    res.status(500).json({ error });
  }
};

export { getUserSettings }