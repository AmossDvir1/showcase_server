import { Request, Response } from "express";
import Picture from "../../../models/Picture";
import { ImagePurpose } from "../../../global";
import sharp from "sharp";

const uploadPicture = async (
  req: Request,
  res: Response,
  purpose: ImagePurpose
) => {
  const data = req.body?.data;
  if (!data) {
    return res.sendStatus(400);
  }

  try {
    // Process the base64 string, removing the prefix if it exists
    const base64Data = data.imageStringBase64.replace(
      /^data:image\/\w+;base64,/,
      ""
    );
    const imageBuffer = Buffer.from(base64Data, "base64");

    // Compress and resize the image using sharp
    const compressedImageBuffer = await sharp(imageBuffer)
      .resize({ width: 800 }) // Resize to a max width, adjust as needed
      .jpeg({ quality: 80 }) // Adjust quality
      .toBuffer();

    // Convert the compressed buffer back to a Base64 string
    const compressedImageBase64 = compressedImageBuffer.toString("base64");

    // Save the compressed image as Base64 to MongoDB
    const image = await Picture.create({
      userId: data.userId,
      filename: data.filename,
      imageStringBase64: compressedImageBase64, // Store as Base64 string
      purpose,
      imageOffset: purpose === "profile" ? data.imageOffset : null,
    });

    res.json({ message: "Picture uploaded successfully", data: image });
  } catch (err) {
    console.error("Error processing image:", err);
    return res
      .status(400)
      .json({
        error: "Invalid image format",
        message: "Unsupported image format",
      });
  }
};

export { uploadPicture };
