import mongoose, { Document, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface ISession extends Document {
  _id: string;
  userId: string;
  token: string;
  device?: { osName: string; browserName: string };
  location?: string;
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new Schema<ISession>(
  {
    _id: {
      type: String,
      required: true,
      default: uuidv4,
    },
    userId: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    device: {
      type: {
        osName: { type: String, default: "" },
        browserName: { type: String, default: "" },
      },
      default: "Unknown Device",
    },
    location: {
      type: String,
      default: "Unknown Location",
    },
  },
  {
    timestamps: true, // This will automatically add createdAt and updatedAt fields
  }
);

const Session = mongoose.model<ISession>("Session", sessionSchema);

export default Session;
