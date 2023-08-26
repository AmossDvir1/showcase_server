import { Request, Response } from "express";
import User from "../../../models/User";

const getProfile = async (req: Request, res: Response) => {
  const data = req?.body;
  if (!data) {
    return res.sendStatus(400);
  }
  const urlMapping = req?.query["urlMapping"];
  const type = req?.query["type"];
  if (!urlMapping) {
    return res
      .status(400)
      .json({ error: "profileNotExists", message: "Profile not exists" });
  }
  if (!type) {
    return res
      .status(400)
      .json({ error: "typeNotExists", message: "Type not exists" });
  }

  try {
    switch (type) {
      case "profile":
        const user = await User.find({ urlMapping });
        console.log(user);

        return res.json(user);
      case "project":
        console.log("this is a project")
    }
  } catch (err) {
    return res
      .status(400)
      .json({ error: "profileNotExists", message: "Profile not exists" });
  }
};

export { getProfile };
