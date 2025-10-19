import { queueHandler } from "../handlers/queueHandler.js";
import { roomHandler } from "../handlers/roomHandler.js";
import { gameHandler } from "../handlers/gameHandler.js";
import { resumeHandler } from "../handlers/resumeHandler.js";
import { GameManager } from "../game/gameManager.js";

export function initializeSocket(io) {
    const gameManager = new GameManager();

    io.on("connection", (socket) => {
        console.log("Player connected:", socket.id);

        // Initialize handlers
        queueHandler(io, socket, gameManager);
        roomHandler(io, socket, gameManager);
        gameHandler(io, socket, gameManager);
        resumeHandler(io, socket, gameManager);

        // Disconnect handler
        socket.on("disconnect", (reason) => {
            console.log(`Player disconnected: ${socket.id}, Reason: ${reason}`);
            handleDisconnect(socket, gameManager);
        });

        // Leave room handler
        socket.on("leave_room", ({ room }) => {
            socket.leave(room);
            console.log(`Player ${socket.data.playerName} left room: ${room}`);
        });
    });

    setInterval(() => {
        gameManager.cleanupWaitingQueue();
    }, 60000);
}

function handleDisconnect(socket, gameManager) {
    gameManager.removeFromQueue(socket.id);

    // Handle active games
    const game = gameManager.findGameByPlayerId(socket.data?.playerId || socket.id);
    if (game) {
        const opponent = game.players.find((p) => p.id !== socket.id);
        if (opponent) {
            const playerInGame = game.players.find((p) => p.id === socket.id);
            socket.to(opponent.id).emit("opponent_disconnected", {
                message: `${playerInGame.name} disconnected`,
                player: playerInGame.name
            });
        }
        gameManager.removeGame(game.room);
        console.log(`Game ${game.room} ended due to disconnect`);
    }

    // Clean up private rooms
    gameManager.cleanupPrivateRooms(socket.id);
}