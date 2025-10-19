"use client";

import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";
import GameField from "@/components/playWithOpponent/gameField";
import { useSocket } from "@/context/SocketContext";
import MatchedIntro from "@/components/playWithOpponent/matchedIntro";
import AnimatedButton from "@/components/common/animatedButton";

interface Player {
    playerId: string;
    name: string;
    symbol: "X" | "O";
}

interface GameOverData {
    winner?: Player | null;
}

export default function PlayWithOpponent() {
    const router = useRouter();
    const { socket } = useSocket();
    const [room, setRoom] = useState("");
    const [playerSymbol, setPlayerSymbol] = useState<"X" | "O">("O");
    const [opponent, setOpponent] = useState<Player | null>(null);
    const [playerName, setPlayerName] = useState("");
    const [gameStarted, setGameStarted] = useState(false);
    const [showMatchIntro, setShowMatchIntro] = useState(false);
    const [yourTurn, setYourTurn] = useState(false);

    useEffect(() => {
        const storedRoom = localStorage.getItem("currentRoom");
        const storedPlayers = localStorage.getItem("currentPlayers");
        const name = localStorage.getItem("playerName");
        const id = localStorage.getItem("playerId");
        const yourSymbol = localStorage.getItem("yourSymbol");
        const currentTurn = localStorage.getItem("currentTurn");

        console.log("STORED DATA:", {
            currentTurn,
            playerId: id,
            comparison: currentTurn === id,
            yourSymbol
        });

        if (currentTurn && id) {
            setYourTurn(currentTurn === id);
        }

        if (!storedRoom || !storedPlayers || !name || !id) {
            router.push("/");
            return;
        }

        setRoom(storedRoom);
        setPlayerName(name);

        const players: Player[] = JSON.parse(storedPlayers);
        const me = players.find((p) => p.playerId === id);
        const opp = players.find((p) => p.playerId !== id);

        if (me) setPlayerSymbol(me.symbol);
        if (opp) setOpponent(opp);

        if (yourSymbol) {
            setPlayerSymbol(yourSymbol as "X" | "O");
        }

        if (!socket) return;

        socket.emit("resume_game", { playerId: id });

        socket.on("opponent_disconnected", () => {
            toast.error("Opponent left the game.");
            setTimeout(() => router.push("/"), 2000);
        });

        socket.on("game_over", (data: GameOverData) => {
            if (data.winner) {
                if (data.winner.playerId === id) {
                    toast.success("You won!");
                } else {
                    toast.error("You lost!");
                }
            } else {
                toast("It's a draw!");
            }
            setTimeout(() => router.push("/"), 3000);
        });

        socket.on("turn_update", (data: { currentTurn: string }) => {
            const myId = localStorage.getItem("playerId");
            setYourTurn(data.currentTurn === myId);
        });

        setShowMatchIntro(true);
        setTimeout(() => {
            setShowMatchIntro(false);
            setGameStarted(true);
        }, 6000);

        return () => {
            socket.off("opponent_disconnected");
            socket.off("game_over");
            socket.off("turn_update");
        };
    }, [socket, router]);

    const handleLeaveGame = () => {
        if (socket) {
            socket.emit("leave_queue");
        }

        setTimeout(() => {
            socket.emit("leave_room", { room });
            localStorage.removeItem("currentRoom");
            localStorage.removeItem("currentPlayers");
            localStorage.removeItem("yourSymbol");
            localStorage.removeItem("activeGame");
            localStorage.removeItem("currentTurn");
            router.push("/");
        }, 4000);
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white relative px-4 pt-8">
            <Toaster position="top-center" />
            <div className="fixed top-0 w-full">
                <AnimatedButton
                    buttonText="Leave the Game"
                    handleButtonClick={handleLeaveGame}
                />
            </div>

            <AnimatePresence mode="wait">
                {showMatchIntro && opponent ? (
                    <MatchedIntro
                        name={playerName}
                        opponent={opponent}
                        playerSymbol={playerSymbol}
                    />
                ) : opponent && gameStarted ? (
                    <motion.div
                        key="game"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="w-full max-w-lg"
                    >
                        <GameField
                            room={room}
                            name={playerName}
                            playerSymbol={playerSymbol}
                            opponent={opponent}
                            socket={socket}
                            yourTurn={yourTurn}
                            setYourTurn={setYourTurn}
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="text-center"
                    >
                        <h1 className="text-2xl font-semibold mb-4">
                            Setting up the match...
                        </h1>
                        <p className="text-gray-400">Please wait a moment.</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}