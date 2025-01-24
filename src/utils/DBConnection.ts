import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

let isConnected = 0;

const connectToDB = async () => {
  try {
    if (!process.env.DB_CONNECTION) {
      return false;
    }
    const db = await mongoose.connect(process.env.DB_CONNECTION);
    isConnected = db.connections[0].readyState; // 1 indicates connected
    if (isConnected) {
      console.log("Connected to DB!");
      return db;
    }
  } catch (err: any) {
    if (err instanceof Error) {
      console.error(`Error connecting to database: ${err.message}`);
      console.error(err);
    } else {
      console.error(`Unknown error connecting to database: ${err}`);
    }
    return false;
  }
};
export { connectToDB };
