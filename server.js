import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

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

let waitingPlayer = null;

io.on("connection", (socket) => {
    console.log("Player connected:", socket.id);

    socket.on("joinQueue", (name) => {
        socket.data.name = name;

        if (waitingPlayer) {
            const room = socket.id + "#" + waitingPlayer.id;
            socket.join(room);
            waitingPlayer.join(room);

            // Assign symbols
            const player1 = { id: waitingPlayer.id, name: waitingPlayer.data.name, symbol: "O" };
            const player2 = { id: socket.id, name, symbol: "X" };

            io.to(room).emit("matchFound", {
                room,
                players: [player1, player2],
            });

            waitingPlayer = null;
        } else {
            waitingPlayer = socket;
            socket.emit("waiting", "Waiting for an opponent...");
        }
    });

    socket.on("playerMove", ({ room, index, symbol }) => {
        socket.to(room).emit("opponentMove", { index, symbol });
    });

    socket.on("disconnect", () => {
        console.log("Player disconnected:", socket.id);
        if (waitingPlayer?.id === socket.id) waitingPlayer = null;

        // Notify opponent if in a room
        const rooms = Array.from(socket.rooms).filter((r) => r !== socket.id);
        rooms.forEach((room) => {
            socket.to(room).emit("opponentDisconnected");
        });
    });
});

server.listen(PORT, () => {
    console.log(`Socket.IO server running on ${PORT}`);
});