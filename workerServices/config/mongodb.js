import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();


export const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected....");
  } catch (error) {
    console.log("DB connection failed");
    console.error(error);
    process.exit(1);
  }
};
