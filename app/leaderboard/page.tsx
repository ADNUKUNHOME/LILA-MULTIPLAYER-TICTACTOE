"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Trophy,
    Users,
    Target,
    BarChart3,
    Crown,
    Medal,
    Star,
    Home,
    RefreshCw
} from "lucide-react";
import { LeaderboardPlayer } from "@/types/leaderboard";
import { useSocket } from "@/context/SocketContext";
import toast from "react-hot-toast";

export default function Leaderboard() {
    const [leaderboard, setLeaderboard] = useState<LeaderboardPlayer[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { socket, } = useSocket();
    const [playerId, setPlayerId] = useState<string>("");
    const [playerName, setPlayerName] = useState<string>("");


    useEffect(() => {
        fetchLeaderboard();
        const storedPlayerId = localStorage.getItem("playerId");
        const storedPlayerName = localStorage.getItem("playerName");
        if (storedPlayerId) setPlayerId(storedPlayerId);
        if (storedPlayerName) setPlayerName(storedPlayerName);
    }, []);

    const fetchLeaderboard = async () => {
        try {
            const response = await fetch("/api/leaderboard");
            const result = await response.json();

            if (result.success) {
                setLeaderboard(result.data);
            }
        } catch (error) {
            console.error("Failed to fetch leaderboard:", error);
            toast.error("Failed to Fetch Leaderboard. Please check your internet.");
        } finally {
            setLoading(false);
        }
    };

    const handlePlayAgain = () => {
        if (!socket) return;
        if (!playerId) {
            toast.error("Player ID not found. Please restart the game.");
            return;
        }
        if (!playerName) {
            toast.error("Player Name not found. Please restart the game.");
            return;
        }
        socket.emit("join_queue", { playerId, playerName });
        router.push("/play/search");
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                    <div className="text-white text-xl font-semibold">
                        Loading leaderboard...
                    </div>
                    <p className="text-purple-200 text-sm">Fetching the latest stats</p>
                </div>
            </div>
        );
    }

    const getRankIcon = (index: number) => {
        switch (index) {
            case 0:
                return <Crown className="w-4 h-4 fill-yellow-400 text-yellow-400" />;
            case 1:
                return <Medal className="w-4 h-4 fill-gray-400 text-gray-400" />;
            case 2:
                return <Medal className="w-4 h-4 fill-orange-500 text-orange-500" />;
            default:
                return <Star className="w-4 h-4 fill-purple-500 text-purple-500" />;
        }
    };

    const getRankColor = (index: number) => {
        switch (index) {
            case 0:
                return "from-yellow-400 to-yellow-600 shadow-lg shadow-yellow-500/25";
            case 1:
                return "from-gray-400 to-gray-600 shadow-lg shadow-gray-500/25";
            case 2:
                return "from-orange-500 to-orange-700 shadow-lg shadow-orange-500/25";
            default:
                return "from-white/20 to-white/10 hover:from-white/30 hover:to-white/20";
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl shadow-2xl shadow-yellow-500/25 mb-6">
                        <Trophy className="w-12 h-12 text-white" />
                    </div>
                    <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-yellow-200 mb-4">
                        Leaderboard
                    </h1>
                    <p className="text-xl text-purple-200 max-w-2xl mx-auto leading-relaxed">
                        Compete with the best strategists and climb to the top of the rankings
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 text-center transform hover:scale-105 transition-all duration-300 hover:bg-white/15">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-2xl mb-4">
                            <Users className="w-8 h-8 text-blue-400" />
                        </div>
                        <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                            {leaderboard.length}
                        </div>
                        <div className="text-gray-300 font-medium mt-2">Active Players</div>
                        <div className="text-sm text-gray-400 mt-1">Competing for glory</div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 text-center transform hover:scale-105 transition-all duration-300 hover:bg-white/15">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-2xl mb-4">
                            <Target className="w-8 h-8 text-green-400" />
                        </div>
                        <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-400">
                            {leaderboard[0]?.wins || 0}
                        </div>
                        <div className="text-gray-300 font-medium mt-2">Top Player Wins</div>
                        <div className="text-sm text-gray-400 mt-1">Unbeatable record</div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 text-center transform hover:scale-105 transition-all duration-300 hover:bg-white/15">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/20 rounded-2xl mb-4">
                            <BarChart3 className="w-8 h-8 text-purple-400" />
                        </div>
                        <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                            {leaderboard.reduce((total, player) => total + player.totalGames, 0)}
                        </div>
                        <div className="text-gray-300 font-medium mt-2">Total Games</div>
                        <div className="text-sm text-gray-400 mt-1">Battles fought</div>
                    </div>
                </div>

                {/* Buttons Section */}
                <div className="flex justify-center gap-4 mt-12 mb-8">
                    <button
                        onClick={() => router.push("/")}
                        className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl font-semibold transition-all duration-300 border border-white/10 hover:border-white/20"
                    >
                        <Home className="w-5 h-5" />
                        Back Home
                    </button>

                    <button
                        onClick={() => handlePlayAgain()}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                    >
                        <RefreshCw className="w-5 h-5" />
                        Play Again
                    </button>
                </div>

                {/* Leaderboard Table */}
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 overflow-hidden shadow-2xl shadow-purple-500/10">
                    <div className="grid grid-cols-12 gap-4 p-6 border-b border-white/10 bg-white/5 font-semibold text-purple-200">
                        <div className="col-span-1 text-center">Rank</div>
                        <div className="col-span-4">Player</div>
                        <div className="col-span-2 text-center">Wins</div>
                        <div className="col-span-2 text-center">Win Rate</div>
                        <div className="col-span-3 text-center">Score</div>
                    </div>

                    {/* Table Body */}
                    <div className="divide-y divide-white/10">
                        {leaderboard.map((player, index) => (
                            <div
                                key={player._id}
                                className={`grid grid-cols-12 gap-4 p-6 transition-all duration-300 hover:bg-white/5 group ${index < 3 ? `bg-gradient-to-r ${getRankColor(index)}` : ""
                                    }`}
                            >
                                {/* Rank */}
                                <div className="col-span-1 flex items-center justify-center">
                                    <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${index < 3
                                        ? "text-white shadow-lg"
                                        : "bg-white/10 text-purple-200 group-hover:bg-white/20"
                                        }`}>
                                        {index < 3 ? getRankIcon(index) : index + 1}
                                    </div>
                                </div>

                                {/* Player Name */}
                                <div className="col-span-4 flex items-center">
                                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center font-bold text-white mr-4 shadow-lg">
                                        {player.playerName?.[0]?.toUpperCase() || 'A'}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-lg group-hover:text-white transition-colors">
                                            {player.playerName || 'Anonymous'}
                                        </div>
                                        <div className="text-sm text-purple-300">
                                            {player.totalGames} games played
                                        </div>
                                    </div>
                                </div>

                                {/* Wins */}
                                <div className="col-span-2 flex items-center justify-center">
                                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-400">
                                        {player.wins}
                                    </span>
                                </div>

                                {/* Win Rate */}
                                <div className="col-span-2 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-xl font-bold text-white">
                                            {player.winRate}%
                                        </div>
                                        <div className="w-16 bg-white/20 rounded-full h-2 mt-1 overflow-hidden">
                                            <div
                                                className="bg-gradient-to-r from-green-400 to-emerald-400 h-full rounded-full transition-all duration-1000"
                                                style={{ width: `${Math.min(player.winRate, 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Score */}
                                <div className="col-span-3 flex items-center justify-center">
                                    <span className="bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-3 rounded-2xl text-lg font-bold shadow-lg shadow-purple-500/25 transform group-hover:scale-110 transition-transform">
                                        {player.score} pts
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {leaderboard.length === 0 && (
                        <div className="text-center py-16">
                            <Trophy className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                            <div className="text-2xl font-bold text-gray-400 mb-2">No Games Played Yet</div>
                            <p className="text-gray-500">Be the first to play and claim the top spot!</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="text-center mt-12 text-gray-400">
                    <p>Leaderboard updates in real-time • Last updated just now</p>
                    <p className="text-sm mt-2">Play more games to climb the ranks!</p>
                </div>
            </div>
        </div>
    );
}
