import mongoose, { Document, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

interface Relationship extends Document {
  user_first_id: {type: Schema.Types.UUID; ref: "User" };
  user_second_id: { type: Schema.Types.UUID; ref: "User" };
  relState:
    | "pending_first_second"
    | "pending_second_first"
    | "friends"
    | "block_first_second"
    | "block_second_first";
}

const relationshipSchema = new Schema<Relationship>({
  user_first_id: { type: Schema.Types.UUID, required: true },
  user_second_id: { type: Schema.Types.UUID, required: true },
  relState: {
    type: String,
    enum: [
      "pending_first_second",
      "pending_second_first",
      "friends",
      "block_first_second",
      "block_second_first",
    ],
    required: true,
  },
});

const Relationship = mongoose.model<Relationship>(
  "Relationship",
  relationshipSchema
);

export default Relationship;
