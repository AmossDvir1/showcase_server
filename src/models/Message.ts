import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  chatId: string; // Reference to the chat this message belongs to
  senderId: string; // User ID who sent the message
  content: string; // The content of the message
  createdAt: Date; // Timestamp of when the message was sent
  readBy: mongoose.Types.ObjectId[]; // Array of user IDs who have read the message
}

const MessageSchema: Schema<IMessage> = new Schema(
  {
    chatId: {
      type: String,
      ref: 'Chat', // Reference to the Chat model
      required: true,
    },
    senderId: {
      type: String,
      ref: 'User', // Reference to the User model (for the sender)
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    readBy: {
      type: [mongoose.Types.ObjectId],
      default: [], // Empty array initially, updated when users read the message
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt timestamps automatically
);

// Index for fast querying by chatId and createdAt (pagination)
MessageSchema.index({ chatId: 1, createdAt: -1 });

const Message = mongoose.model<IMessage>('Message', MessageSchema);

export default Message;