import User from "./User";
import { Schema, model, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IMessage extends Document {
  sender: string;
  content: string;
  chat: string;
}

const MessageSchema = new Schema<IMessage>(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
    sender: { type: String, ref: "User" },
    content: { type: String },
    chat: { type: String, ref: "Char" },
  },
  { timestamps: true }
);

const Message = model<IMessage>("Message", MessageSchema);

export default Message;
