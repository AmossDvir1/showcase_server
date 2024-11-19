import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

interface ITechnologiesInventoryDocument extends Document {
  _id: string;
  label: string;
  category?: string; // E.g., "Programming Language", "Framework"
  icon?: string; // Optional field for UI representation
  color: string;
}

const TechnologiesInventorySchema: Schema = new Schema({
  _id: {
    type: String,
    required: true,
    default: uuidv4,
  },
  label: { type: String, required: true, unique: true },
  category: { type: String }, // Optional, e.g., "Backend", "Frontend"
  icon: { type: String }, // Optional, e.g., URL for an icon or a CSS class
  color: {type: String }
});

export default mongoose.model<ITechnologiesInventoryDocument>(
  "TechnologiesInventory",
  TechnologiesInventorySchema
);
