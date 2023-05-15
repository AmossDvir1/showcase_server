import { Schema, model, Document } from "mongoose";

interface Session {
  token: string;
  createdAt: number;
}

type SessionType = { token: string; createdAt: Date };

// const sessionSchema = new Schema<Session>({
//   token: {
//     type: String,
//     default: "",
//   },
// });

// export default model<Session>("Session", sessionSchema);

export { Session, SessionType };
