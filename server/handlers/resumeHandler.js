export function resumeHandler(io, socket, gameManager) {
    socket.on("resume_game", ({ playerId }) => {
        const foundGame = gameManager.findGameByPlayerId(playerId);

        if (foundGame && foundGame.status === "playing") {
            socket.join(foundGame.room);
            const player = foundGame.players.find(p => p.playerId === playerId);
            socket.emit("resume_success", {
                ...foundGame,
                yourSymbol: player?.symbol,
                currentTurn: foundGame.turn
            });
        } else {
            socket.emit("resume_fail", { message: "No active game found" });
        }
    });
}