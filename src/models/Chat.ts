import User from "./User";
import { Schema, model, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import Message from "./Message";

export interface IChat extends Document {
  chatName: string;
  users: string[];
  isGroupChat: boolean;
  latestMessage?: string;
  groupAdmin?: string;
}

const ChatSchema = new Schema<IChat>(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
    chatName: {
      type: String,
      default: "",
      trim: true,
    },
    users: [
      {
        type: String,
        ref: User,
        required: true,
      },
    ],
    isGroupChat: { type: Boolean },
    latestMessage: {
      type: String,
      ref: Message,
    },
    groupAdmin: {
      type: String,
      ref: User,
    },
  },
  { timestamps: true }
);

const Chat = model<IChat>("Chat", ChatSchema);

export default Chat;
