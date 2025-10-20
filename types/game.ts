export interface Player {
    playerId: string;
    name: string;
    symbol: "X" | "O";
}


export interface GameData {
    player1: string;
    player2: string;
    winner: string | null;
    result: "win" | "loss" | "draw";
    type: "quick" | "private";
    player1Name?: string;
    player2Name?: string;
    winningSymbol?: "X" | "O";
    duration?: number;
}

export interface GameResult {
    player1: string;
    player2: string;
    winner: string | null;
    result: "win" | "loss" | "draw";
    type: "quick" | "private";
    player1Name?: string;
    player2Name?: string;
    winningSymbol?: "X" | "O";
    duration?: number;
}

export interface LeaderboardStats {
    _id: string;
    wins: number;
    totalGames: number;
    winRate: number;
    playerName?: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
    count?: number;
    updatedAt?: string;
}