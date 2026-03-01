import mongoose from "mongoose";

export async function connectDB() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
      throw new Error("MongoDB credentials required");
    }

    await mongoose.connect(MONGODB_URI);

    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
}
