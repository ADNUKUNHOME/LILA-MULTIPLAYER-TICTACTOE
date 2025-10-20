import dotenv from 'dotenv';
import mongoose from "mongoose";

dotenv.config({ path: './server/.env' });
const connection = {};

export const dbConnect = async () => {
    if (connection.isConnected) {
        return;
    }

    if (!process.env.MONGODB_URI) {
        throw new Error("MONGODB_URI environment variable is not defined");
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI);
        connection.isConnected = db.connections[0].readyState;

        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw new Error(`Database connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};
