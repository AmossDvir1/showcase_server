import { Schema, model, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IProfilePicture extends Document {
  userId: { type: string; ref: "User" };
  _id: string;
  filename: string;
  mimeType?: string;
  imageStringBase64: string;
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
});

const ProfilePicture = model<IProfilePicture>(
  "ProfilePicture",
  profilePictureSchema
);

export default ProfilePicture;
