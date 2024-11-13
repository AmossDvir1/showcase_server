import mongoose, { Schema, Document } from "mongoose";

export interface IChat extends Document {
  participants: string[]; // users IDs
  createdAt: Date;
  lastMessage: { text: string; createdAt: Date }; // Last message preview
}

const ChatSchema: Schema<IChat> = new Schema(
  {
    participants: {
      type: [String],
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    lastMessage: {
      text: {
        type: String,
        required: false, // Optional: You can leave this empty if no messages are sent yet
      },
      createdAt: {
        type: Date,
        required: false, // Optional: If you don't want to set it initially
      },
    },
  },
  { timestamps: true } // Mongoose will automatically add createdAt and updatedAt fields
);

// Middleware to sort participants array before saving
ChatSchema.pre("save", function (next) {
    this.participants.sort();
    next();
  });
  
  // Compound index on participants array to ensure unique pairs
  ChatSchema.index({ participants: 1 }, { unique: true });

const Chat = mongoose.model<IChat>("Chat", ChatSchema);

export default Chat;
