import 'dotenv/config';
import mongoose from 'mongoose';
import { setServers } from "node:dns/promises"; 

setServers(["1.1.1.1", "8.8.8.8"]); 

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully via Mongoose!");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
