"use client";

import { Circle, X } from "lucide-react";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import type { MotionStyle, Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import io from "socket.io-client";
import WinAnimation from "./winAnimations/WinAnimation";
import LoseAnimation from "./LoseAnimation";
import DrawAnimation from "./DrawAnimation";
import GetWinningLineStyle from "./winAnimations/winningLineStyle";
import { MotionDiv } from "@/lib/motion";

interface Props {
    socket: ReturnType<typeof io>;
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
    const [winningLine, setWinningLine] = useState<number[] | null>(null);
    const [showResult, setShowResult] = useState(false);
    const router = useRouter();

    // Initialize turn based on symbol
    useEffect(() => {
        setYourTurn(playerSymbol === "O");
    }, [playerSymbol]);

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
                setWinningLine([a, b, c]);
                return board[a];
            }
        }

        if (board.every((cell) => cell !== null)) return "draw";
        return null;
    };

    const handleGameOver = (result: "X" | "O" | "draw") => {
        if (result !== "draw") {
            setTimeout(() => setShowResult(true), 600);
        } else {
            setShowResult(true);
        }

        setTimeout(() => router.push("/"), 4000);
    };

    const handleClick = (index: number) => {
        if (board[index] || !yourTurn || winner) return;

        setBoard((prev) => {
            const newBoard = [...prev];
            newBoard[index] = playerSymbol;

            const result = checkWinner(newBoard);
            if (result) {
                setWinner(result);
                handleGameOver(result);
            }

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
                if (result) {
                    setWinner(result);
                    handleGameOver(result);
                }

                return newBoard;
            });

            if (!winner) setYourTurn(true);
        };

        socket.on("opponentMove", moveHandler);

        return () => {
            socket.off("opponentMove", moveHandler);
        };
    }, [socket, winner]);


    // Animation variants
    const iconVariants: Variants = {
        hidden: { scale: 0, opacity: 0 },
        visible: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 500 } },
    };

    const winningLineVariants: Variants = {
        hidden: { scaleX: 0 },
        visible: { scaleX: 1, transition: { duration: 0.5 } },
    };


    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] w-[400px] relative overflow-hidden">

            {/* Modern Win Animation */}
            <WinAnimation
                winner={winner}
                playerSymbol={playerSymbol}
                showResult={showResult}
            />

            {/* Modern Lose Animation */}
            <LoseAnimation
                show={!!winner && winner !== playerSymbol && winner !== "draw"}
                board={board}
                winner={winner}
                playerSymbol={playerSymbol}
                showResult={showResult}
            />

            {/* Draw Animation */}
            <DrawAnimation show={winner === "draw" && showResult} />

            {/* Game UI */}
            <h2 className="mb-4 font-bold text-lg">
                {!winner ? (yourTurn ? "Your Turn" : "Opponent's Turn") : ""}
            </h2>

            <div className="relative w-72 h-72">
                {/* Grid lines */}
                <div className="absolute top-1/3 left-0 w-full h-[4px] bg-white" />
                <div className="absolute top-2/3 left-0 w-full h-[4px] bg-white" />
                <div className="absolute top-0 left-1/3 h-full w-[4px] bg-white" />
                <div className="absolute top-0 left-2/3 h-full w-[4px] bg-white" />

                {/* Winning line */}
                {winningLine && (
                    <MotionDiv
                        className="absolute bg-black"
                        style={GetWinningLineStyle({ winningLine }) as MotionStyle}
                        variants={winningLineVariants}
                        initial="hidden"
                        animate="visible"
                    />
                )}

                <div className="grid grid-cols-3 grid-rows-3 w-full h-full">
                    {board.map((cell, index) => (
                        <button
                            key={index}
                            onClick={() => handleClick(index)}
                            className="flex items-center justify-center text-4xl font-bold"
                        >
                            <AnimatePresence>
                                {cell && (
                                    <MotionDiv
                                        key={index}
                                        variants={iconVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="hidden"
                                    >
                                        {cell === "O" ? (
                                            <Circle className="w-16 h-16 text-blue-500" />
                                        ) : (
                                            <X className="w-16 h-16 text-red-500" />
                                        )}
                                    </MotionDiv>
                                )}
                            </AnimatePresence>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TicTacToeGrid;