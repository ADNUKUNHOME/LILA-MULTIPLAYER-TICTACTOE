"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";
import { MotionDiv } from "@/lib/motion";
import { toast } from "react-hot-toast";
import {
  Search,
  Users,
  Play,
  Trophy,
  User,
  Sparkles,
  Shield,
  Zap,
  Crown,
  RefreshCw
} from "lucide-react";
import { useSocket } from "@/context/SocketContext";

interface RoomEventData {
  roomCode: string;
}

interface ErrorEventData {
  message?: string;
}

interface MatchFoundData {
  room: string;
  players: { id: string; playerId: string; name: string; symbol: string }[];
  yourSymbol: string;
  currentTurn: string;
}

export default function Home() {
  const router = useRouter();
  const [playerName, setPlayerName] = useState("");
  const [playerId, setPlayerId] = useState("");
  const [status, setStatus] = useState("Connecting to server...");
  const [roomCode, setRoomCode] = useState("");
  const [serverConnected, setServerConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeGame, setActiveGame] = useState(false);
  const { socket, isConnected } = useSocket();

  // Initialize Player Identity
  useEffect(() => {
    let storedId = localStorage.getItem("playerId");
    const storedName = localStorage.getItem("playerName");

    if (!storedId) {
      storedId = nanoid();
      localStorage.setItem("playerId", storedId);
    }

    if (storedName) {
      setPlayerName(storedName);
    }

    setPlayerId(storedId);

    const gameState = localStorage.getItem("activeGame");
    setActiveGame(!!gameState);
  }, []);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    if (isConnected) {
      setServerConnected(true);
      setStatus("Connected to Game Server");
    }

    const handleConnect = (): void => {
      setServerConnected(true);
      setStatus("Connected to Game Server");
      toast.success("Connected to game server!");
    };

    const handleDisconnect = (): void => {
      setServerConnected(false);
      setStatus("Disconnected from server");
      toast.error("Disconnected from server");
      setIsLoading(false);
    };

    const handleRoomCreated = (data: RoomEventData): void => {
      setIsLoading(false);
      router.push(`/play/room/${data.roomCode}`);
    };

    const handleRoomJoined = (data: RoomEventData): void => {
      setIsLoading(false);
      router.push(`/play/room/${data.roomCode}`);
    };

    const handleMatchFound = (data: MatchFoundData): void => {
      setIsLoading(false);
      localStorage.setItem("currentRoom", data.room);
      localStorage.setItem("currentPlayers", JSON.stringify(data.players));
      localStorage.setItem("yourSymbol", data.yourSymbol);
      localStorage.setItem("activeGame", "true");
      localStorage.setItem("currentTurn", data.currentTurn);
      toast.success("Opponent found! Starting game...");
      setTimeout(() => router.push("/play/game"), 500);
    };

    const handleError = (error: ErrorEventData): void => {
      toast.error(error.message || "An error occurred");
      setIsLoading(false);
    };

    const handleWaiting = (data: { message: string; queuePosition: number }): void => {
      setStatus(`${data.message}`);
    };

    // Add all event listeners
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("room_created", handleRoomCreated);
    socket.on("room_joined", handleRoomJoined);
    socket.on("match_found", handleMatchFound);
    socket.on("error", handleError);
    socket.on("waiting", handleWaiting);

    // Cleanup function
    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("room_created", handleRoomCreated);
      socket.off("room_joined", handleRoomJoined);
      socket.off("match_found", handleMatchFound);
      socket.off("error", handleError);
      socket.off("waiting", handleWaiting);
    };
  }, [socket, router]);


  const handleQuickMatch = () => {
    if (!playerName.trim()) {
      toast.error("Please enter your name to play!");
      return;
    }

    if (!serverConnected) {
      toast.error("Not connected to server");
      return;
    }

    setIsLoading(true);
    setStatus("Finding opponent...");
    localStorage.setItem("playerName", playerName);
    socket.emit("join_queue", { playerId, playerName });
    router.push("/play/search");
  };


  const handleCreateRoom = () => {
    if (!playerName.trim()) {
      toast.error("Please enter your name!");
      return;
    }

    if (!serverConnected) {
      toast.error("Not connected to server");
      return;
    }

    setIsLoading(true);
    localStorage.setItem("playerName", playerName);
    const code = Math.random().toString(36).substring(2, 7).toUpperCase();
    setRoomCode(code);
    socket.emit("create_room", { playerId, playerName, roomCode: code });
  };

  const handleJoinRoom = () => {
    if (!playerName.trim()) {
      toast.error("Please enter your name!");
      return;
    }
    if (!roomCode.trim()) {
      toast.error("Please enter room code!");
      return;
    }

    if (!serverConnected) {
      toast.error("Not connected to server");
      return;
    }

    setIsLoading(true);
    localStorage.setItem("playerName", playerName);
    socket.emit("join_room", { playerId, playerName, roomCode: roomCode.toUpperCase() });
  };

  const handleResume = () => {
    socket.emit("resume_game", { playerId });
    router.push("/play/resume");
  };

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Quick Match",
      description: "Find opponents instantly"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Private Rooms",
      description: "Play with friends"
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      title: "Leaderboard",
      description: "Compete for top spots"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure",
      description: "Real-time protected games"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-10">
        {/* Header */}
        <MotionDiv
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex justify-center items-center mb-6">
            <div className="relative">
              <Crown className="w-12 h-12 text-white mb-4 animate-pulse" />
              <Sparkles className="w-6 h-6 text-yellow-400 absolute animate-pulse -top-1 -right-1" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200 mb-4">
            Tic Tac Toe
          </h1>
          <p className="text-xl text-purple-200 mb-2">Multiplayer Experience</p>
          <div className="flex items-center justify-center gap-2 text-sm text-green-400">
            <div className={`w-2 h-2 rounded-full ${serverConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
            <span>{status}</span>
          </div>
          {
            !isConnected &&
            <span
              onClick={() => window.location.reload()}
              className="text-yellow-500 bg-white/10 flex items-center justify-center gap-2 mt-4 px-4 py-2 rounded-xl border border-yellow-500 cursor-pointer w-max mx-auto"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </span>
          }
        </MotionDiv>

        <div className="max-w-4xl mx-auto">
          {/* Player Setup */}
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 mb-12"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Welcome, Strategist!</h2>
              <p className="text-purple-200">Enter your name to begin your journey</p>
            </div>

            <div className="max-w-md mx-auto mb-8">
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Enter your legendary name..."
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  onKeyPress={(e) => e.key === 'Enter' && handleQuickMatch()}
                />
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {features.map((feature, index) => (
                <MotionDiv
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  className="text-center p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all cursor-default"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-500/20 rounded-lg mb-3">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold mb-1">{feature.title}</h3>
                  <p className="text-sm text-purple-200">{feature.description}</p>
                </MotionDiv>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <MotionDiv
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <button
                  onClick={handleQuickMatch}
                  disabled={!serverConnected || isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
                >
                  <Search className="w-5 h-5" />
                  {isLoading ? "Finding Match..." : "Quick Match"}
                </button>
              </MotionDiv>

              <MotionDiv
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <button
                  onClick={handleCreateRoom}
                  disabled={!serverConnected || isLoading}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
                >
                  <Users className="w-5 h-5" />
                  Create Private Room
                </button>
              </MotionDiv>
            </div>

            {/* Room Code Input */}
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="max-w-md mx-auto mt-6"
            >
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Enter room code"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                    onKeyPress={(e) => e.key === 'Enter' && handleJoinRoom()}
                  />
                </div>
                <button
                  onClick={handleJoinRoom}
                  disabled={!serverConnected || isLoading || !roomCode.trim()}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 whitespace-nowrap"
                >
                  Join Room
                </button>
              </div>
            </MotionDiv>

            {/* Resume Game */}
            {activeGame && (
              <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="text-center mt-6"
              >
                <button
                  onClick={handleResume}
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl font-semibold transition-all duration-300 border border-white/10 hover:border-white/20"
                >
                  <Play className="w-4 h-4" />
                  Resume Previous Game
                </button>
              </MotionDiv>
            )}
          </MotionDiv>

          {/* Bottom Options */}
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center"
          >
            <button
              onClick={() => router.push("/leaderboard")}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 px-8 py-4 rounded-xl font-semibold transition-all duration-300 mb-6 border border-white/10 hover:border-white/20"
            >
              <Trophy className="w-5 h-5" />
              View Leaderboard
            </button>

            <div className="text-sm text-gray-400 space-y-2">
              <p>Player ID: {playerId}</p>
              <p className="text-xs opacity-70">
                © {new Date().getFullYear()} Tic Tac Toe • Built for Lila Backend Engineering Test
              </p>
              <p className="text-xs opacity-50">
                Crafted with ♥ by MUHAMMAD ADNAN K
              </p>
            </div>
          </MotionDiv>
        </div>
      </div>
    </div>
  );
}