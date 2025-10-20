"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Copy, Users, Share2, Clock } from "lucide-react";
import { toast } from "react-hot-toast";
import { useSocket } from "@/context/SocketContext";

interface PlayerJoinedData {
    playerName: string;
    playerId: string;
}

interface MatchFoundData {
    room: string;
    players: Array<{
        name: string;
        playerId: string;
        symbol: string;
    }>;
    yourSymbol: string;
    currentTurn: string;
}


export default function RoomPage() {
    const params = useParams();
    const router = useRouter();
    const { socket } = useSocket();
    const roomCode = params.roomCode as string;

    const [players, setPlayers] = useState<Array<{ name: string; id: string }>>([]);

    useEffect(() => {
        const name = localStorage.getItem("playerName");
        const id = localStorage.getItem("playerId");

        if (name && players.length === 0) {
            setPlayers([{ name, id: id || "" }]);
        }
    }, [players.length]);

    useEffect(() => {
        if (!socket) return;

        // Listen for player joining
        const handlePlayerJoined = (data: PlayerJoinedData) => {
            setPlayers(prev => [...prev, { name: data.playerName, id: data.playerId }]);
            toast.success(`${data.playerName} joined the room!`);
        };

        // Listen for game start
        const handleMatchFound = (data: MatchFoundData) => {
            localStorage.setItem("currentRoom", data.room);
            localStorage.setItem("currentPlayers", JSON.stringify(data.players));
            localStorage.setItem("yourSymbol", data.yourSymbol);
            localStorage.setItem("activeGame", "true");
            localStorage.setItem("currentTurn", data.currentTurn);
            toast.success("Game starting!");
            setTimeout(() => router.push("/play/game"), 1000);
        };

        socket.on("player_joined", handlePlayerJoined);
        socket.on("match_found", handleMatchFound);

        return () => {
            socket.off("player_joined", handlePlayerJoined);
            socket.off("match_found", handleMatchFound);
        };
    }, [socket, router]);

    const copyRoomCode = () => {
        navigator.clipboard.writeText(roomCode);
        toast.success("Room code copied to clipboard!");
    };

    const shareRoom = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Join my Tic Tac Toe game!',
                    text: `Use code ${roomCode} to join my Tic Tac Toe game`,
                    url: window.location.href,
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            copyRoomCode();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 w-full max-w-md"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/20 rounded-full mb-4">
                        <Users className="w-8 h-8 text-purple-400" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Private Room</h1>
                    <p className="text-purple-200">Share the code with a friend</p>
                </div>

                {/* Room Code */}
                <div className="bg-black/30 rounded-xl p-4 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-400">Room Code</p>
                            <p className="text-2xl font-mono font-bold tracking-wider">{roomCode}</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={copyRoomCode}
                                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                                title="Copy code"
                            >
                                <Copy className="w-5 h-5" />
                            </button>
                            <button
                                onClick={shareRoom}
                                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                                title="Share room"
                            >
                                <Share2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Players List */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Players ({players.length}/2)</h3>
                    <div className="space-y-2">
                        {players.map((player, index) => (
                            <div
                                key={player.id}
                                className="flex items-center gap-3 bg-white/5 rounded-lg p-3"
                            >
                                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-sm font-bold">
                                    {player.name[0].toUpperCase()}
                                </div>
                                <span className="flex-1">{player.name} {index === 0 && "👑"}</span>
                            </div>
                        ))}

                        {players.length === 1 && (
                            <div className="flex items-center gap-3 bg-white/5 rounded-lg p-3 opacity-60">
                                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                                    <Clock className="w-4 h-4" />
                                </div>
                                <span>Waiting for opponent...</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Status Message */}
                <div className="text-center">
                    {players.length === 1 ? (
                        <div className="text-yellow-400 mb-4">
                            <p>Waiting for another player to join...</p>
                            <p className="text-sm text-yellow-300 mt-1">Share the room code to invite a friend!</p>
                        </div>
                    ) : players.length === 2 ? (
                        <div className="text-green-400 mb-4">
                            <p>Game will start automatically...</p>
                        </div>
                    ) : null}

                    <button
                        onClick={() => router.push("/")}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        Back to Home
                    </button>
                </div>
            </motion.div>
        </div>
    );
}