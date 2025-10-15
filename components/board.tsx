"use client";

import { useState, useEffect } from "react";
import type { Socket } from "socket.io-client";

interface Props {
    socket: Socket;
    playerSymbol: "X" | "O";
    room: string;
}

interface MoveData {
    index: number;
    symbol: "X" | "O";
}

const TicTacToeGrid = ({ socket, playerSymbol, room }: Props) => {
    const [board, setBoard] = useState<Array<"X" | "O" | null>>(Array(9).fill(null));
    const [yourTurn, setYourTurn] = useState(false);
    const [winner, setWinner] = useState<"X" | "O" | "draw" | null>(null);

    // Initialize turn based on symbol
    useEffect(() => {
        setYourTurn(playerSymbol === "O"); // O always starts first
    }, [playerSymbol]);

    // Check winner helper
    const checkWinner = (board: Array<"X" | "O" | null>) => {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];

        for (const [a, b, c] of lines) {
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a]; // "X" or "O"
            }
        }

        if (board.every((cell) => cell !== null)) return "draw";

        return null;
    };

    const handleClick = (index: number) => {
        if (board[index] || !yourTurn || winner) return;

        setBoard((prev) => {
            const newBoard = [...prev];
            newBoard[index] = playerSymbol;

            const result = checkWinner(newBoard);
            if (result) setWinner(result);

            return newBoard;
        });

        setYourTurn(false);

        socket.emit("playerMove", { room, index, symbol: playerSymbol });
    };

    useEffect(() => {
        const moveHandler = ({ index, symbol }: MoveData) => {
            setBoard((prev) => {
                const newBoard = [...prev];
                newBoard[index] = symbol;

                const result = checkWinner(newBoard);
                if (result) setWinner(result);

                return newBoard;
            });

            if (!winner) setYourTurn(true);
        };

        socket.on("opponentMove", moveHandler);

        return () => {
            socket.off("opponentMove", moveHandler);
        };
    }, [socket, winner]);

    return (
        <div
            className={`min-h-[400px] w-[400px] rounded-2xl shadow-2xl flex flex-col items-center justify-center transition-colors duration-300 ${winner
                ? winner === "draw"
                    ? "bg-gray-400"
                    : winner === playerSymbol
                        ? "bg-green-300"
                        : "bg-red-300"
                : yourTurn
                    ? "bg-orange-300"
                    : "bg-blue-300"
                }`}
        >
            <h2 className="mb-4 font-bold text-lg">
                {!winner ? (yourTurn ? "Your Turn" : "Opponent's Turn") : ""}
            </h2>

            {winner && (
                <h2 className="mb-4 font-bold text-xl text-green-700">
                    {winner === "draw"
                        ? "It's a Draw!"
                        : winner === playerSymbol
                            ? "You Win! 🎉"
                            : "You Lose 😢"}
                </h2>
            )}

            <div className="relative w-72 h-72">
                {/* Grid lines */}
                <div className="absolute top-1/3 left-0 w-full h-[4px] bg-black" />
                <div className="absolute top-2/3 left-0 w-full h-[4px] bg-black" />
                <div className="absolute top-0 left-1/3 h-full w-[4px] bg-black" />
                <div className="absolute top-0 left-2/3 h-full w-[4px] bg-black" />

                <div className="grid grid-cols-3 grid-rows-3 w-full h-full">
                    {board.map((cell, index) => (
                        <button
                            key={index}
                            onClick={() => handleClick(index)}
                            className="flex items-center justify-center text-4xl font-bold"
                        >
                            {cell === "O" && <span className="text-blue-500">⭕</span>}
                            {cell === "X" && <span className="text-red-500">❌</span>}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TicTacToeGrid;