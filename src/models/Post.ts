import { Schema, model, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { IUserDetails } from "./User";

interface IComment {
  content: string;
  user: IUserDetails;
  likes: string[];
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  // comments: IComment[];
}

export interface IPost extends Document {
  title: string;
  content: string;
  likes: string[];
  comments: IComment[];
  isExposed: boolean;
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  user: IUserDetails;
}

const postSchema = new Schema<IPost>(
  {
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
    comments: [
      {
        content: { type: String, required: true },
        user: {
          userStr: { type: String, required: true },
          userId: { type: String, required: true },
          urlMapping: {type: String, required: true }
        },
        likes: { type: [String], default: [] },
        _id: { type: String, required: true, default: uuidv4 },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
      },
    ],
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
    user: {
      type: {
        userStr: { type: String, required: true },
        userId: { type: String, required: true },
        urlMapping: {type: String, required: true }
      },
      required: true,
    }
  },
  {
    timestamps: true, // This will enable Mongoose to automatically manage createdAt and updatedAt
  }
);

export default model<IPost>("Post", postSchema);
