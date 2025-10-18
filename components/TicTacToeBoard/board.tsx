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
    board?: Array<"X" | "O" | null>;
    nextTurn?: string;
    currentPlayer?: string;
}

interface GameOverData {
    winner?: { playerId: string; symbol: "X" | "O" } | null;
    board: Array<"X" | "O" | null>;
    winningLine?: number[];
}

const TicTacToeGrid = ({ socket, playerSymbol, room }: Props) => {
    const [board, setBoard] = useState<Array<"X" | "O" | null>>(Array(9).fill(null));
    const [yourTurn, setYourTurn] = useState(false);
    const [winner, setWinner] = useState<"X" | "O" | "draw" | null>(null);
    const [winningLine, setWinningLine] = useState<number[] | null>(null);
    const [showResult, setShowResult] = useState(false);
    const router = useRouter();
    const playerId = localStorage.getItem("playerId");

    useEffect(() => {
        setYourTurn(playerSymbol === "X");
    }, [playerSymbol]);


    const handleGameOver = (result: "X" | "O" | "draw") => {
        console.log("Handling game over with result:", result);

        if (result !== "draw") {
            setTimeout(() => setShowResult(true), 600);
        } else {
            setShowResult(true);
        }

        setTimeout(() => {
            socket.emit("leave_room", { room });
            localStorage.removeItem("currentRoom");
            localStorage.removeItem("currentPlayers");
            localStorage.removeItem("yourSymbol");
            localStorage.removeItem("activeGame");
            router.push("/");
        }, 4000);
    };

    const handleClick = (index: number) => {
        if (board[index] || !yourTurn || winner) return;

        const newBoard = [...board];
        newBoard[index] = playerSymbol;
        setBoard(newBoard);
        setYourTurn(false);

        socket.emit("playerMove", { room, index, symbol: playerSymbol });
    };


    useEffect(() => {
        const moveHandler = (data: MoveData) => {
            if (winner) return;

            const { index, symbol, board: newBoard, nextTurn } = data;

            if (newBoard) {
                setBoard(newBoard);
            } else {
                setBoard(prev => {
                    const updatedBoard = [...prev];
                    updatedBoard[index] = symbol;
                    return updatedBoard;
                });
            }

            if (nextTurn && playerId) {
                setYourTurn(nextTurn === playerId);
            } else {
                setYourTurn(prev => !prev);
            }
        };

        const gameOverHandler = (data: GameOverData) => {
            console.log("Game over received:", data);

            setBoard(data.board);

            if (data.winningLine) {
                setWinningLine(data.winningLine);
            }

            let gameResult: "X" | "O" | "draw" | null = null;

            if (data.winner) {
                console.log("Winner data:", data.winner, "My playerId:", playerId);
                if (data.winner.playerId === playerId) {
                    gameResult = playerSymbol;
                    console.log("I won!");
                } else {
                    gameResult = playerSymbol === "X" ? "O" : "X";
                    console.log("I lost");
                }
            } else {
                gameResult = "draw";
                console.log("It's a draw");
            }

            setWinner(gameResult);
            setYourTurn(false);
            handleGameOver(gameResult);
        };

        socket.on("opponentMove", moveHandler);
        socket.on("game_over", gameOverHandler);

        return () => {
            socket.off("opponentMove", moveHandler);
            socket.off("game_over", gameOverHandler);
        };
    }, [socket, playerSymbol, playerId, winner]);

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

            {/* Win Animation */}
            <WinAnimation
                winner={winner}
                playerSymbol={playerSymbol}
                showResult={showResult}
            />

            {/* Lose Animation */}
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
                        className="absolute bg-yellow-400 z-10"
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
                            className="flex items-center justify-center text-4xl font-bold relative z-20"
                            disabled={!yourTurn || !!winner || !!cell}
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