import { Schema, model, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IComment {
  id: string[];
  commentStr: string;
}

export interface IPost extends Document {
  title: string;
  content: string;
  likes: string[];
  comments: IComment[];
  isExposed: boolean;
  _id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IPost>(
  {
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
    likes: {
      type: [String],
      default: [],
    },
    comments: {
      type: [
        {
          id: { type: String, required: true, default: uuidv4 },
          commentStr: { type: String, required: true },
        },
      ],
      default: [],
    },
    isExposed: {
      index: true,
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // This will enable Mongoose to automatically manage createdAt and updatedAt
  }
);

export default model<IPost>("Post", userSchema);
