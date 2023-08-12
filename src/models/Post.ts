import { Schema, model, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IPost extends Document {
  title: string;
  content: string;
  isExposed: boolean;
  _id: string;
  userId: { type: Schema.Types.ObjectId; ref: "User" }
}

const userSchema = new Schema<IPost>({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  _id: {
    type: String,
    default: uuidv4,
  },
  title: {
    index: true,
    type: String,
    required: true,
    minlength: 2,
  },
  content: {
    index: true,
    type: String,
  },
  isExposed: {
    index: true,
    type: Boolean,
    default: true,
  },
});

export default model<IPost>("Post", userSchema);
