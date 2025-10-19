import { v4 as uuidv4 } from "uuid";
import { checkWinner, getWinningLine } from "./GameLogic.js";

export class GameManager {
    constructor() {
        this.waitingQueue = [];
        this.activeGames = new Map();
        this.privateRooms = new Map();
    }

    // Queue management
    addToQueue(socket) {
        if (!this.waitingQueue.some(s => s.id === socket.id)) {
            this.waitingQueue.push(socket);
        }
    }

    removeFromQueue(socketId) {
        const idx = this.waitingQueue.findIndex((s) => s.id === socketId);
        if (idx !== -1) {
            this.waitingQueue.splice(idx, 1);
        }
    }

    findOpponent(playerId) {
        return this.waitingQueue.findIndex(opponent =>
            opponent.data.playerId !== playerId && opponent.connected
        );
    }

    // Game management
    createGame(player1, player2, isPrivate = false) {
        const gameId = uuidv4();
        const room = isPrivate ? `private_${gameId}` : `room_${gameId}`;

        const symbols = ["X", "O"];
        const randomIndex = Math.floor(Math.random() * 2);

        const players = [
            {
                id: player1.id,
                playerId: player1.data.playerId,
                name: player1.data.playerName,
                symbol: symbols[randomIndex]
            },
            {
                id: player2.id,
                playerId: player2.data.playerId,
                name: player2.data.playerName,
                symbol: symbols[1 - randomIndex]
            }
        ];

        const game = {
            id: gameId,
            room,
            board: Array(9).fill(null),
            players,
            turn: players.find(p => p.symbol === "X").playerId,
            status: "playing",
            createdAt: Date.now(),
            isPrivate
        };

        this.activeGames.set(room, game);
        return game;
    }

    getGame(room) {
        return this.activeGames.get(room);
    }

    removeGame(room) {
        this.activeGames.delete(room);
    }

    findGameByPlayerId(playerId) {
        return Array.from(this.activeGames.values()).find((game) =>
            game.players.some((p) => p.playerId === playerId)
        );
    }

    // Private room management
    createPrivateRoom(roomCode, hostSocket) {
        const room = `private_${roomCode}`;
        this.privateRooms.set(roomCode, {
            room,
            host: hostSocket.id,
            players: [{
                id: hostSocket.id,
                playerId: hostSocket.data.playerId,
                playerName: hostSocket.data.playerName,
                socket: hostSocket
            }],
            createdAt: Date.now()
        });
        return room;
    }

    getPrivateRoom(roomCode) {
        return this.privateRooms.get(roomCode);
    }

    removePrivateRoom(roomCode) {
        this.privateRooms.delete(roomCode);
    }

    joinPrivateRoom(roomCode, socket) {
        const roomData = this.privateRooms.get(roomCode);
        if (roomData) {
            roomData.players.push({
                id: socket.id,
                playerId: socket.data.playerId,
                playerName: socket.data.playerName,
                socket: socket
            });
            return roomData;
        }
        return null;
    }

    // Game logic
    makeMove(room, playerId, index, symbol) {
        const game = this.activeGames.get(room);
        if (!game || game.status !== "playing") {
            return { error: "Game not found or ended" };
        }

        if (game.turn !== playerId) {
            return { error: "Not your turn" };
        }

        if (game.board[index]) {
            return { error: "Cell already taken" };
        }

        // Update board
        game.board[index] = symbol;

        const winner = checkWinner(game.board);

        if (winner === "draw") {
            game.status = "draw";
            return { game, winner: null, isDraw: true };
        } else if (winner) {
            game.status = "ended";
            const winningPlayer = game.players.find(p => p.symbol === winner);
            return { game, winner: winningPlayer, isDraw: false, winningLine: getWinningLine(game.board) };
        } else {
            // Switch turns
            const nextPlayer = game.players.find((p) => p.playerId !== playerId);
            game.turn = nextPlayer.playerId;
            return { game, nextTurn: game.turn };
        }
    }

    // Cleanup
    cleanupWaitingQueue() {
        const now = Date.now();
        for (let i = this.waitingQueue.length - 1; i >= 0; i--) {
            const socket = this.waitingQueue[i];
            if (!socket.connected || (socket.data.joinTime && now - socket.data.joinTime > 300000)) {
                this.waitingQueue.splice(i, 1);
                socket.emit("queue_timeout");
            }
        }
    }

    cleanupPrivateRooms(socketId) {
        for (const [roomCode, roomData] of this.privateRooms.entries()) {
            const playerIndex = roomData.players.findIndex(p => p.id === socketId);
            if (playerIndex !== -1) {
                if (roomData.players.length === 1) {
                    this.privateRooms.delete(roomCode);
                    console.log(`Private room ${roomCode} deleted due to host disconnect`);
                } else {
                    roomData.players.splice(playerIndex, 1);
                }
                break;
            }
        }
    }
}