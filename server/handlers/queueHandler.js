export function queueHandler(io, socket, gameManager) {
    socket.on("join_queue", ({ playerId, playerName }) => {
        // Clear any existing queue entry
        gameManager.removeFromQueue(socket.id);

        socket.data = { playerId, playerName, inQueue: true };

        const opponentIndex = gameManager.findOpponent(playerId);

        if (opponentIndex !== -1) {
            const opponent = gameManager.waitingQueue.splice(opponentIndex, 1)[0];
            const game = gameManager.createGame(socket, opponent);

            // Both players join the room
            socket.join(game.room);
            opponent.join(game.room);

            socket.data.inQueue = false;
            opponent.data.inQueue = false;

            console.log(`Game started: ${game.room} between ${game.players[0].name} (${game.players[0].symbol}) and ${game.players[1].name} (${game.players[1].symbol})`);

            socket.emit("match_found", {
                room: game.room,
                players: game.players,
                yourSymbol: game.players[0].symbol,
                currentTurn: game.turn
            });

            opponent.emit("match_found", {
                room: game.room,
                players: game.players,
                yourSymbol: game.players[1].symbol,
                currentTurn: game.turn
            });

            io.to(game.room).emit("turn_update", {
                currentTurn: game.turn
            });

        } else {
            gameManager.addToQueue(socket);
            socket.emit("waiting", {
                message: "Waiting for opponent...",
                queuePosition: gameManager.waitingQueue.length
            });
            console.log(`Player ${playerName} added to queue. Queue size: ${gameManager.waitingQueue.length}`);
        }
    });

    socket.on("leave_queue", () => {
        gameManager.removeFromQueue(socket.id);
        socket.data.inQueue = false;
        socket.emit("queue_left");
        console.log(`Player ${socket.data.playerName} left queue`);
    });
}