export function gameHandler(io, socket, gameManager) {
    socket.on("playerMove", ({ room, index, symbol }) => {
        const result = gameManager.makeMove(room, socket.data.playerId, index, symbol);

        if (result.error) {
            return socket.emit("invalid", result.error);
        }

        const { game, winner, isDraw, nextTurn, winningLine } = result;

        if (winner || isDraw) {
            // Game ended
            io.to(room).emit("game_over", {
                winner: isDraw ? null : {
                    playerId: winner.playerId,
                    symbol: winner.symbol,
                    name: winner.name
                },
                board: game.board,
                winningLine: winningLine || null
            });
            gameManager.removeGame(room);
        } else {
            // Continue game
            io.to(room).emit("opponentMove", {
                index,
                symbol,
                board: game.board,
                nextTurn: nextTurn,
                currentPlayer: socket.data.playerId
            });
        }
    });
}