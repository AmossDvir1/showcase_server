// import { Schema, model } from "mongoose";
// import { v4 as uuidv4 } from "uuid";
// import { IUserDetails } from "./User";


// export interface IComment {
//     content: string;
//     user: IUserDetails;
//     likes: string[];
//     _id: string;
//     createdAt: Date;
//     updatedAt: Date;
//   }

//   const commentSchema = new Schema<IComment>(
//     {
//       _id: {
//         type: String,
//         required: true,
//         default: uuidv4,
//       },
//       content: { type: String, required: true },
//       user: {
//         type: {
//           userStr: { type: String, required: true },
//           userId: { type: String, required: true },
//         },
//         required: true,
//       },
//       likes: { type: [String], default: [] },
//       createdAt: {
//         type: Date,
//         default: Date.now,
//       },
//       updatedAt: {
//         type: Date,
//         default: Date.now,
//       },
//     },
//     {
//       timestamps: true, // This will enable Mongoose to automatically manage createdAt and updatedAt
//     }
//   );

//   export default commentSchema;

  