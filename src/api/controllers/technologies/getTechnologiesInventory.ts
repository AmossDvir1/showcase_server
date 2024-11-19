import { Request, Response } from "express";
import TechnologiesInventory from "../../../models/TechnologiesInventory";

export const getTechnologiesInventory = async (req: Request, res: Response) => {
  try {
    const inventory = await TechnologiesInventory.find({});
    res.status(200).json({ technologies: inventory });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch technologies inventory" });
  }
};
