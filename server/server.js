import dotenv from 'dotenv';
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { initializeSocket } from "./config/socket.js";
import { dbConnect } from "./config/dbConnect.js";

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config({ path: './server/.env' });

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'Tic-Tac-Toe Socket Server'
    });
});

// Game statistics endpoint
app.get('/stats/:playerId', async (req, res) => {
    try {
        const { playerId } = req.params;
        const stats = await GameService.getPlayerStats(playerId);
        res.json({ success: true, data: stats });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

const server = http.createServer(app);
const PORT = process.env.PORT || 4000;

const io = new Server(server, {
    cors: {
        origin: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
    },
});

// Initialize database and socket handlers
const initializeServer = async () => {
    try {
        await dbConnect();
        console.log('Database connected successfully');

        initializeSocket(io);
        console.log('Socket handlers initialized');

        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`Health check: http://localhost:${PORT}/health`);
        });
    } catch (error) {
        console.error('Failed to initialize server:', error);
        process.exit(1);
    }
};

initializeServer();

export { io, server };