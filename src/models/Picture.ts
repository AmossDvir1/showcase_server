import { Schema, model, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { ImagePurpose } from "../global";

export interface ImageOffset {
  x: number;
  y: number;
}

interface ImageDimensions {
  width: number;
  height: number;
}

export interface IPicture extends Document {
  userId: { type: string; ref: "User" };
  _id: string;
  filename: string;
  mimeType?: string;
  imageStringBase64: string;
  purpose: ImagePurpose;
  imageOffset: ImageOffset;
  originalDimensions: ImageDimensions;
}

const PictureSchema = new Schema<IPicture>({
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
  imageOffset: {
    type: { x: { type: Number }, y: { type: Number } },
    default: null,
  },
  originalDimensions: {
    type: { width: { type: Number }, height: { type: Number } },
    default: null,
  },
});

const Picture = model<IPicture>("Picture", PictureSchema);

export default Picture;
