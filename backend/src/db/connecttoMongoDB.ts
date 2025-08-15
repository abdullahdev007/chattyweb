import mongoose from "mongoose";

const connectToMongoDB = async (): Promise<void> => {
  try {
    const uri: string | undefined = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MONGODB_URI is not defined in environment variables.");
    }
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (error: any) {
    console.log("Error connecting to MongoDB", error.message);
  }
};

export default connectToMongoDB;
