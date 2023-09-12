import { Schema, model, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IPost extends Document {
  title: string;
  content: string;
  isExposed: boolean;
  _id: string;
  userId: { type: string; ref: "User" }
}

const userSchema = new Schema<IPost>({
  userId: { type: String, ref: "User" },
  _id: {
    type: String,
    required: true,
    default: uuidv4,
  },
  title: {
    index: true,
    type: String,
    minlength: 2,
  },
  content: {
    minlength: 2,
    index: true,
    required: true,
    type: String,
  },
  isExposed: {
    index: true,
    type: Boolean,
    default: true,
  },
});

export default model<IPost>("Post", userSchema);
