export interface LeaderboardPlayer {
    _id: string;
    playerId: string;
    playerName: string;
    wins: number;
    losses: number;
    draws: number;
    totalGames: number;
    winRate: number;
    score: number;
}