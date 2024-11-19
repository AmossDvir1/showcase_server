import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IUserTechnologies extends Document {
  _id: string;
  userId: mongoose.Types.ObjectId;
  technologies: string[];
}

const UserTechnologiesSchema: Schema = new Schema({
  _id: {
    type: String,
    required: true,
    default: uuidv4,
  },
  userId: { type: String, required: true, ref: "User" },
  technologies: { type: [String], ref: "TechnologiesInventory" },
});

export default mongoose.model<IUserTechnologies>(
  "UserTechnologies",
  UserTechnologiesSchema
);
