"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import { useSocket } from "@/context/SocketContext";

interface MatchFoundData {
    room: string;
    players: { id: string; playerId: string; name: string; symbol: string }[];
    yourSymbol: string;
    currentTurn: string;
}

export default function SearchOpponent() {
    const router = useRouter();
    const [status, setStatus] = useState("Connecting to server...");
    const { socket } = useSocket();

    useEffect(() => {
        if (!socket) return;

        const playerId = localStorage.getItem("playerId");
        const playerName = localStorage.getItem("playerName");

        if (!playerId || !playerName) {
            router.push("/");
            return;
        }

        const handleWaiting = (data: { message: string; queuePosition: number }) => {
            setStatus(`${data.message}`);
        };

        const handleMatchFound = (data: MatchFoundData) => {
            localStorage.setItem("currentRoom", data.room);
            localStorage.setItem("currentPlayers", JSON.stringify(data.players));
            localStorage.setItem("yourSymbol", data.yourSymbol);
            localStorage.setItem("activeGame", "true");
            localStorage.setItem("currentTurn", data.currentTurn);
            toast.success("Opponent found!");
            setTimeout(() => router.push("/play/game"), 200);
        };

        const handleDisconnect = () => {
            setStatus("Disconnected from server");
            toast.error("Lost connection to server");
        };

        const handleError = (error: { message: string }) => {
            toast.error(error.message);
            router.push("/");
        };

        // Set up event listeners
        socket.on("waiting", handleWaiting);
        socket.on("match_found", handleMatchFound);
        socket.on("disconnect", handleDisconnect);
        socket.on("error", handleError);

        socket.emit("join_queue", { playerId, playerName });

        return () => {
            // Clean up event listeners
            socket.off("waiting", handleWaiting);
            socket.off("match_found", handleMatchFound);
            socket.off("disconnect", handleDisconnect);
            socket.off("error", handleError);
        };
    }, [socket, router]);

    const handleCancel = () => {
        if (socket) {
            socket.emit("leave_queue");
        }
        router.push("/");
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white text-center px-4">
            <Toaster position="top-center" />
            <Loader2 className="w-16 h-16 text-purple-500 animate-spin mb-8" />
            <h1 className="text-2xl font-bold mb-4">Searching for Opponent...</h1>
            <p className="text-gray-400 mb-2">{status}</p>
            <p className="text-gray-500 text-sm">Please wait while we find a suitable opponent</p>

            <button
                onClick={handleCancel}
                className="mt-10 bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-xl font-semibold transition-all"
            >
                Cancel Search
            </button>
        </div>
    );
}