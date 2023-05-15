import { Schema, model, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import passportLocalMongoose from "passport-local-mongoose";

interface Session {
  token: string;
  createdAt: number;
}
export interface User extends Document {
  username: string;
  // _id?: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
  refreshToken: Session[];
}

const userSchema = new Schema<User>({
  _id: {
    type: String,
    default: uuidv4,
  },
  username: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  password: {
    type: String,
    // required: true,
    minlength: 8,
    select: false, // exclude this field from query results by default
  },
  firstName: {
    type: String,
    minlength: 2,
  },
  lastName: {
    type: String,
    minlength: 2,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  refreshToken: { type: [], default: [] },
});

userSchema.set("toJSON", {
  transform: function (doc, ret, options) {
    delete ret.refreshToken;
    return ret;
  },
});

userSchema.plugin(passportLocalMongoose);

export default model<User>("User", userSchema);
