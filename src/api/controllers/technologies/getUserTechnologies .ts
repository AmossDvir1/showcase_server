import { Request, Response } from "express";
import UserTechnologies from "../../../models/UserTechnologies";

export const getUserTechnologies = async (req: Request, res: Response) => {
  const userId = req.query["userId"];

  try {
    const techData = await UserTechnologies.findOne({ userId })
      .populate("technologies") // Populates the technologies field
      .exec();
    if (!techData) {
      return res.json({ technologies: [] });
    }
    res.json({ technologies: techData.technologies });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch technologies" });
  }
};
