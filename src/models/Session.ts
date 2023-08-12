import mongoose, { Document, Schema } from "mongoose";

export interface ISession extends Document {
  userId: string;
  token: string;
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new Schema<ISession>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    token: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // This will automatically add createdAt and updatedAt fields
  }
);

const Session = mongoose.model<ISession>("Session", sessionSchema);

export default Session;
