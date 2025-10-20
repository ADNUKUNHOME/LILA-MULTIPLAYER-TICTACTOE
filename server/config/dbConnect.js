import dotenv from 'dotenv';
import mongoose from "mongoose";

dotenv.config({ path: './server/.env' });
const connection = {};

export const dbConnect = async () => {
    if (connection.isConnected) {
        return;
    }

    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI environment variable is not defined");
    }

    try {
        const db = await mongoose.connect(process.env.MONGO_URI);
        connection.isConnected = db.connections[0].readyState;

        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw new Error(`Database connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};
