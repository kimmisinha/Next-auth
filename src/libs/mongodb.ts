import mongoose from "mongoose";

interface MongoDBConfig {
  MONGODB_URI?: string;
}

const mongoDBConfig: MongoDBConfig = {
  MONGODB_URI: process.env.MONGODB_URI,
};

export const connectMongoDB = async (): Promise<void> => {
  try {
    if (!mongoDBConfig.MONGODB_URI) {
      throw new Error("MongoDB URI is not defined in environment variables.");
    }

    await mongoose.connect(mongoDBConfig.MONGODB_URI);
    console.log("Connected to MongoDB.");
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error connecting to MongoDB:", error.message);
    } else {
      console.error("Unknown error connecting to MongoDB:", error);
    }
  }
};
