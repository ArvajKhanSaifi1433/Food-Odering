import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}`
    );
    console.log(
      `\nMongoDB Connected || DB Host ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log(`Mongo Connection Field Error`, error);
    process.exit(1);
  }
};

export { connectDB };
