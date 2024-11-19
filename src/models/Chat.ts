// import User, { IUser } from "./User";
// import mongoose, { Schema, Document } from "mongoose";
// import { v4 as uuidv4 } from "uuid";

// export interface IChat extends Document {
//   _id: string;
//   participants: {id: string}[]; // users IDs
//   createdAt: Date;
//   lastMessage: { text: string; createdAt: Date }; // Last message preview
// }

// const ChatSchema: Schema<IChat> = new Schema(
//   {
//     _id: {
//       type: String,
//       required: true,
//       default: uuidv4,
//     },
//     participants: [{id: {type: String, required: true, ref: "User",}} ],
//     createdAt: {
//       type: Date,
//       default: Date.now,
//     },
//     lastMessage: {
//       text: {
//         type: String,
//         required: false, // Optional: You can leave this empty if no messages are sent yet
//       },
//       createdAt: {
//         type: Date,
//         required: false, // Optional: If you don't want to set it initially
//       },
//     },
//   },
//   { timestamps: true } // Mongoose will automatically add createdAt and updatedAt fields
// );

// // Middleware to sort participants array before saving
// ChatSchema.pre("save", function (next) {
//   this.participants.sort((idA, idB) => (idA < idB ? 1 : -1));
//   next();
// });

// // Index on participants array to ensure unique pairs
// ChatSchema.index({ participants: 1 }, { unique: true });

// const Chat = mongoose.model<IChat>("Chat", ChatSchema);

// export default Chat;















import mongoose, { Document, Schema } from 'mongoose';
import { v4 as uuidv4 } from "uuid";

// Define the LastMessage interface
interface LastMessage {
  text: string;
  createdAt: Date | null;
}

// Define the Chat interface extending Mongoose's Document
export interface Chat extends Document {
  _id: string;
  participants: string[];
  participantsKey: string;
  createdAt: Date;
  lastMessage: LastMessage;
}

// Define the schema
const chatSchema = new Schema<Chat>(
  {
    _id: {
      type: String,
      required: true,
      default: uuidv4,
    },
    participants: {
      type: [String],
      required: true,
      validate: {
        validator: (v: string[]) => v.length >= 2,
        message: 'A chat must have at least two participants.',
      },
    },
    participantsKey: {
      type: String,
      // required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    lastMessage: {
      text: {
        type: String,
        default: '',
      },
      createdAt: {
        type: Date,
        default: null,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to normalize participants and set participantsKey
chatSchema.pre<Chat>(/^(updateOne|save|findOneAndUpdate|create)/, async function (next) {
  this.participants?.sort(); // Ensure consistent order
  this.participantsKey = this.participants?.join('|'); // Concatenate for unique key
  next();
});

// Create a unique index for the participantsKey
chatSchema.index({ participantsKey: 1 }, { unique: true });

// Export the Chat model
const ChatModel = mongoose.model<Chat>('Chat', chatSchema);

export default ChatModel;