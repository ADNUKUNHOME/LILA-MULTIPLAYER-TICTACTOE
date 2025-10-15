"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import io from "socket.io-client";
import NameInputField from "@/components/playWithOpponent/nameInputField";
import FindingOpponentField from "@/components/playWithOpponent/findingOpponentField";
import OpponentNotFound from "@/components/playWithOpponent/notFound";
import MatchedIntro from "@/components/playWithOpponent/matchedIntro";
import GameField from "@/components/playWithOpponent/gameField";


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
    const [stage, setStage] = useState<"input" | "loading" | "notfound" | "matched" | "game">("input");
    const [timer, setTimer] = useState(30);
    const [warning, setWarning] = useState("");
    const [opponent, setOpponent] = useState<Player | null>(null);
    const [room, setRoom] = useState("");
    const [playerSymbol, setPlayerSymbol] = useState<"X" | "O">("O");
    const socketRef = useRef<ReturnType<typeof io> | null>(null);
    const router = useRouter();

    // Handle timer for finding opponent
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (stage === "loading" && timer > 0) {
            interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
        } else if (timer === 0 && stage === "loading") {
            // Disconnect after timeout
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
            setStage("notfound");
        }
        return () => clearInterval(interval);
    }, [stage, timer]);

    // Connect socket only when starting to find match
    const connectSocket = (playerName: string) => {
        if (socketRef.current) return;

        if (!process.env.NEXT_PUBLIC_SOCKET_SERVER_URL) {
            throw new Error("NEXT_PUBLIC_SOCKET_SERVER_URL is not defined in .env.local");
        }

        const socket = io(process.env.NEXT_PUBLIC_SOCKET_SERVER_URL, {
            transports: ["websocket"],
            reconnection: false,
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
            setStage("matched");

            // Wait 5 seconds before entering the game
            setTimeout(() => {
                setStage("game");
            }, 5000);
        });


        // Listen for opponent disconnect
        socket.on("opponentDisconnected", () => {
            alert("Your opponent left the game.");
            router.push("/");
        });

        socket.on("disconnect", () => {
            console.log("Disconnected from server");
        });
    };

    const handleContinue = () => {
        if (!name.trim() || name.trim().length < 3 || name.trim().length > 10) {
            setWarning("Name must be between 3 and 10 characters.");
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
                <span className="font-medium">
                    {
                        stage === "game" ? "Exit" : "Home"
                    }
                </span>
            </button>

            <AnimatePresence mode="wait">
                {stage === "input" && (
                    <NameInputField
                        name={name}
                        setName={setName}
                        warning={warning}
                        handleContinue={handleContinue}
                    />
                )}

                {stage === "loading" && (
                    <FindingOpponentField
                        timer={timer}
                        handleCancel={handleCancel}
                    />
                )}

                {stage === "notfound" && (
                    <OpponentNotFound
                        handleRetry={handleContinue}
                        handleCancel={handleCancel}
                    />
                )}

                {stage === "matched" && opponent && (
                    <MatchedIntro
                        name={name}
                        playerSymbol={playerSymbol}
                        opponent={opponent}
                    />
                )}


                {stage === "game" && opponent && (
                    <GameField
                        room={room}
                        name={name}
                        playerSymbol={playerSymbol}
                        opponent={opponent}
                        socketRef={socketRef}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default PlayWithOpponent;
