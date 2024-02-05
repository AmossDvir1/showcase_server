import { Schema, model, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IProject extends Document {
  title: string;
  description: string;
  isExposed: boolean;
  _id: string;
  userId: { type: string; ref: "User" };
}

const userSchema = new Schema<IProject>({
  userId: { type: String, ref: "User", required: true },
  _id: {
    type: String,
    required: true,
    default: uuidv4,
  },
  title: {
    index: true,
    type: String,
    required: true,
    minlength: 2,
  },
  description: {
    index: true,
    type: String,
  },
  isExposed: {
    index: true,
    type: Boolean,
    default: true,
  },
});

export default model<IProject>("Project", userSchema);
