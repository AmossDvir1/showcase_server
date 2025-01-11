import { Request, Response } from "express";
import TechnologiesInventory from "../../../models/TechnologiesInventory";

const getTechnology = async (req: Request, res: Response) => {
  const techId = req?.query["id"];
  if (!techId) {
    return res
      .status(400)
      .json({ error: "technologyNotExists", message: "Technology not exists" });
  }

  try {
    const tech = await TechnologiesInventory.findById(techId);
    return res.json({tech})
  } catch (err: any) {
    console.error(err);
    return res
      .status(400)
      .json({ error: "technologyNotExists", message: "Technology not exists" });
  }
};

export { getTechnology };
