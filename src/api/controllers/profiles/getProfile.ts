import { Request, Response } from "express";
import User from "../../../models/User";
import Picture from "../../../models/Picture";

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
        const user = await User.findOne({ urlMapping });
        if (!user) {
          return res.status(500).json({ message: "No user found" });
        }
        const profilePicture = await Picture.findOne({
          userId: user._id,
          purpose: "profile",
        });
        const coverPhoto = await Picture.findOne({
          userId: user._id,
          purpose: "cover",
        });

        return res.json({
          firstName: user?.firstName,
          lastName: user?.lastName,
          username: user?.username,
          id: user?._id,
          urlMapping: user?.urlMapping,
          profilePicture: profilePicture?.imageStringBase64 || null,
          coverPhoto: coverPhoto?.imageStringBase64 || null,
        });
      case "project":
        console.log("this is a project");
    }
  } catch (err: any) {
    console.error(err);
    return res
      .status(400)
      .json({ error: "profileNotExists", message: "Profile not exists" });
  }
};

export { getProfile };
