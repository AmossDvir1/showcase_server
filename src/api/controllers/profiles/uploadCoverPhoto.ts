import { Request, Response } from "express";
import User from "../../../models/User";
import ProfilePicture from "../../../models/ProfilePicture";

const uploadCoverPhoto = async (req: Request, res: Response) => {
  const data = req.body?.data;
  if (!data) {
    return res.sendStatus(400);
  }

  try {
    const image = ProfilePicture.create({
      userId: data.userId,
      filename: data.filename,
      imageStringBase64: data.imageStringBase64,
      purpose: "cover"
    });
    res.json({ message: "Profile picture uploaded successfully", data: image });
  } catch (err) {
    return res.status(400).json({ error: "", message: "" });
  }
};

export { uploadCoverPhoto };
