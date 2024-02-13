import { Request, Response } from "express";
import Picture from "../../../models/Picture";
import { ImagePurpose } from "../../../global";

const uploadPicture = async (req: Request, res: Response, purpose: ImagePurpose) => {
  const data = req.body?.data;
  if (!data) {
    return res.sendStatus(400);
  }

  try {
    const image = Picture.create({
      userId: data.userId,
      filename: data.filename,
      imageStringBase64: data.imageStringBase64,
      purpose
    });
    res.json({ message: " picture uploaded successfully", data: image });
  } catch (err) {
    return res.status(400).json({ error: "", message: "" });
  }
};

export { uploadPicture };
