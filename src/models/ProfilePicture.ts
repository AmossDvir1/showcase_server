import { Schema, model, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { ImageType } from "../global";

export interface IProfilePicture extends Document {
  userId: { type: string; ref: "User" };
  _id: string;
  filename: string;
  mimeType?: string;
  imageStringBase64: string;
  purpose: ImageType;
}

const profilePictureSchema = new Schema<IProfilePicture>({
  _id: {
    type: String,
    default: uuidv4,
  },
  userId: { type: String, ref: "User", required: true },
  filename: {
    type: String,
    required: true,
  },
  mimeType: {
    type: String,
    required: false,
  },
  imageStringBase64: {
    type: String,
    required: true,
  },
  purpose: { type: String, required: true, default: "profile" },
});

const ProfilePicture = model<IProfilePicture>(
  "ProfilePicture",
  profilePictureSchema
);

export default ProfilePicture;
