import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectToDB = async () => {
  try {
    if (!process.env.DB_CONNECTION) {
      return false;
    }
    await mongoose.connect(process.env.DB_CONNECTION);
    const db = mongoose.connection.db
    console.log("Connected to DB!");
    return db;
  } catch (err: any) {
    if (err instanceof Error) {
      console.error(`Error connecting to database: ${err.message}`);
    } else {
      console.error(`Unknown error connecting to database: ${err}`);
    }
    return false;
  }
};
export { connectToDB };
