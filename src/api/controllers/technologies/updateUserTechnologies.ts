import { Request, Response } from "express";
import UserTechnologies from "../../../models/UserTechnologies";
import { IUser } from "../../../models/User";

export const updateUserTechnologies = async (req: Request, res: Response) => {
  const user = req.user as IUser;

  const { technologies } = req.body;

  if (!Array.isArray(technologies)) {
    return res.status(400).json({ error: "Technologies must be an array" });
  }

  try {
    const techDoc = await UserTechnologies.findOneAndUpdate(
      { userId: user._id },
      { $set: { technologies } },
      { upsert: true, new: true } // Create if not exists
    );

    res.json({ message: "User's Technologies updated", technologies: techDoc.technologies });
  } catch (err) {
    res.status(500).json({ error: "Failed to update technologies" });
  }
};
