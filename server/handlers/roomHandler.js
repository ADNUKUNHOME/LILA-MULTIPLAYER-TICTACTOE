export function roomHandler(io, socket, gameManager) {
    socket.on("create_room", ({ playerId, playerName, roomCode }) => {
        socket.data = { playerId, playerName };

        if (gameManager.getPrivateRoom(roomCode)) {
            return socket.emit("error", { message: "Room code already exists" });
        }

        const room = gameManager.createPrivateRoom(roomCode, socket);
        socket.join(room);

        socket.emit("room_created", { roomCode });
        console.log(`Private room created: ${roomCode} by ${playerName}`);
    });

    socket.on("join_room", ({ playerId, playerName, roomCode }) => {
        const roomData = gameManager.getPrivateRoom(roomCode);
        if (!roomData) {
            return socket.emit("error", { message: "Room not found" });
        }

        if (roomData.players.length >= 2) {
            return socket.emit("error", { message: "Room is full" });
        }

        if (roomData.players.some(p => p.playerId === playerId)) {
            return socket.emit("error", { message: "You are already in this room" });
        }

        socket.data = { playerId, playerName };
        socket.join(roomData.room);

        const updatedRoomData = gameManager.joinPrivateRoom(roomCode, socket);
        socket.emit("room_joined", { roomCode });

        socket.to(roomData.room).emit("player_joined", {
            playerId,
            playerName
        });

        if (updatedRoomData.players.length === 2) {
            const game = gameManager.createGame(
                updatedRoomData.players[0].socket,
                socket,
                true
            );

            gameManager.removePrivateRoom(roomCode);

            console.log(`Private game started: ${game.room} between ${game.players[0].name} (${game.players[0].symbol}) and ${game.players[1].name} (${game.players[1].symbol})`);

            const currentTurnPlayerId = game.turn;

            updatedRoomData.players[0].socket.emit("match_found", {
                room: game.room,
                players: game.players,
                yourSymbol: game.players[0].symbol,
                currentTurn: currentTurnPlayerId
            });

            socket.emit("match_found", {
                room: game.room,
                players: game.players,
                yourSymbol: game.players[1].symbol,
                currentTurn: currentTurnPlayerId
            });

            setTimeout(() => {
                io.to(game.room).emit("turn_update", {
                    currentTurn: currentTurnPlayerId
                });
            }, 100);
        }
    });
}