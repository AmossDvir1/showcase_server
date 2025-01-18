import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

interface IWork {
  jobTitle: string;
  workPlace: string;
  startedAt: Date;
  primary: boolean;
}

export interface IProfile {
  technologies: string[]; // Store technology IDs
  bio: string;
  relationshipStatus?: string;
  work?: IWork[] | [];
}
export interface IGeneral {
  usingAIAssistant: boolean;
}

export interface IUserSettings extends Document {
  _id: string;
  userId: string;
  profile: IProfile;
  general: IGeneral;
}

const UserSettingsSchema: Schema = new Schema({
  _id: {
    type: String,
    required: true,
    default: uuidv4,
    ref: "User",
  },
  userId: { type: String, required: true, ref: "User" },
  profile: {
    technologies: [{ type: String, ref: "TechnologiesInventory" }], // Reference IDs
    bio: { type: String, default: "" },
    work: [
      {
        type: {
          jobTitle: { type: String, default: "" },
          workPlace: { type: String, default: "" },
          startedAt: { type: Date, default: Date.now() },
          primary: { type: Boolean, default: false },
        },
      },
    ],
    relationshipStatus: { type: String, default: "" }, // E.g., "Single", "Married"
  },
  general: {
    type: {
      usingAIAssistant: { type: Boolean, default: true },
    },
  },
});

export default mongoose.model<IUserSettings>(
  "UserSettings",
  UserSettingsSchema
);
