"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import io, { Socket } from "socket.io-client";
import TicTacToeGrid from "@/components/board";

interface Player {
    id: string;
    name: string;
    symbol: "X" | "O";
}

interface MatchData {
    room: string;
    players: Player[];
}

const PlayWithOpponent = () => {
    const [name, setName] = useState("");
    const [stage, setStage] = useState<"input" | "loading" | "notfound" | "game">("input");
    const [timer, setTimer] = useState(30);
    const [warning, setWarning] = useState("");
    const [opponent, setOpponent] = useState<Player | null>(null);
    const [room, setRoom] = useState("");
    const [playerSymbol, setPlayerSymbol] = useState<"X" | "O">("O");
    const socketRef = useRef<Socket | null>(null);
    const router = useRouter();

    // Handle timer for finding opponent
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (stage === "loading" && timer > 0) {
            interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
        } else if (timer === 0 && stage === "loading") {
            setStage("notfound");
        }
        return () => clearInterval(interval);
    }, [stage, timer]);

    // Connect socket only when starting to find match
    const connectSocket = (playerName: string) => {
        if (socketRef.current) return; // already connected

        const socket = io("http://192.168.43.125:4000", {
            transports: ["websocket"],
            reconnection: false, // prevent auto-reconnect on refresh
        });

        socketRef.current = socket;

        socket.emit("joinQueue", playerName);

        socket.on("waiting", (msg: string) => {
            console.log("Waiting:", msg);
        });

        socket.on("matchFound", ({ room, players }: MatchData) => {
            const me = players.find((p) => p.name === playerName)!;
            const opponentPlayer = players.find((p) => p.name !== playerName)!;
            setPlayerSymbol(me.symbol);
            setOpponent(opponentPlayer);
            setRoom(room);
            setStage("game");
        });

        socket.on("disconnect", () => {
            console.log("Disconnected from server");
        });
    };

    const handleContinue = () => {
        if (!name.trim()) {
            setWarning("Please enter your name.");
            return;
        }

        setWarning("");
        setStage("loading");
        setTimer(30);

        connectSocket(name);
    };

    const handleCancel = () => {
        setStage("input");
        setName("");
        setTimer(30);
        setWarning("");
        setOpponent(null);

        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
        }
    };

    // Handle full page unmount — disconnect cleanly
    useEffect(() => {
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-900 text-white px-4 relative">
            <button
                onClick={() => {
                    if (socketRef.current) {
                        socketRef.current.disconnect();
                        socketRef.current = null;
                    }
                    router.push("/");
                }}
                className="absolute top-6 left-6 flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 px-4 py-2 rounded-2xl shadow-lg transition-all"
            >
                <ChevronLeft size={20} />
                <span className="font-medium">Back</span>
            </button>

            <AnimatePresence mode="wait">
                {stage === "input" && (
                    <motion.div
                        key="input"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-neutral-800 rounded-3xl p-10 w-full max-w-md shadow-xl flex flex-col gap-4 items-center"
                    >
                        <h1 className="text-2xl font-bold text-center">Enter Your Name</h1>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Nickname..."
                            className="w-full px-4 py-3 rounded-xl text-white border border-orange-400 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        {warning && <p className="text-red-500 text-sm font-medium">{warning}</p>}
                        <button
                            onClick={handleContinue}
                            className="w-full bg-orange-500 hover:bg-orange-600 py-3 rounded-2xl font-semibold transition-all"
                        >
                            Continue
                        </button>
                    </motion.div>
                )}

                {stage === "loading" && (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="bg-neutral-800 rounded-3xl p-10 w-full max-w-md shadow-xl flex flex-col items-center gap-6"
                    >
                        <h1 className="text-2xl font-bold text-center">Finding a Random Player</h1>
                        <p className="text-gray-300 text-center">
                            It usually takes <span className="font-semibold">{timer}</span> seconds
                        </p>

                        {/* Loading Dots */}
                        <div className="flex gap-2 mt-4">
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    className="w-4 h-4 bg-orange-500 rounded-full"
                                    animate={{
                                        scale: [1, 1.6, 1],
                                        opacity: [1, 0.5, 1],
                                    }}
                                    transition={{
                                        duration: 1.2,
                                        repeat: Infinity,
                                        delay: i * 0.2,
                                    }}
                                />
                            ))}
                        </div>

                        <button
                            onClick={handleCancel}
                            className="mt-6 px-6 py-2 border border-gray-600 rounded-2xl hover:bg-gray-700 transition"
                        >
                            Cancel
                        </button>
                    </motion.div>
                )}

                {stage === "notfound" && (
                    <motion.div
                        key="notfound"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="bg-neutral-800 rounded-3xl p-10 w-full max-w-md shadow-xl flex flex-col items-center gap-6"
                    >
                        <h1 className="text-2xl font-bold text-center text-red-400">No Player Found 😕</h1>
                        <p className="text-gray-300 text-center">Please try again later.</p>
                        <button
                            onClick={handleCancel}
                            className="mt-4 bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-2xl font-semibold transition"
                        >
                            Go Back
                        </button>
                    </motion.div>
                )}

                {stage === "game" && opponent && (
                    <motion.div
                        key="game"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center gap-6"
                    >
                        <div className="flex gap-4 items-center">
                            <div className="flex flex-col items-center">
                                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center font-bold text-white">
                                    {name[0].toUpperCase()}
                                </div>
                                <p className="text-sm mt-1">
                                    {name} ({playerSymbol})
                                </p>
                            </div>
                            <span className="text-gray-300">VS</span>
                            <div className="flex flex-col items-center">
                                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center font-bold text-white">
                                    {opponent.name[0].toUpperCase()}
                                </div>
                                <p className="text-sm mt-1">
                                    {opponent.name} ({opponent.symbol})
                                </p>
                            </div>
                        </div>

                        <TicTacToeGrid socket={socketRef.current!} playerSymbol={playerSymbol} room={room} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PlayWithOpponent;