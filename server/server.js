import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { initializeSocket } from "./config/socket.js";

const app = express();
app.use(cors());

const server = http.createServer(app);
const PORT = process.env.PORT || 4000;

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

// Initialize socket handlers
initializeSocket(io);

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export { io };