import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { Game } from "@/models/game";

interface LeaderboardEntry {
    _id: string;
    wins: number;
    totalGames: number;
    winRate: number;
    playerName?: string;
}

export async function GET(): Promise<NextResponse> {
    try {
        await dbConnect();

        const leaderboard = await Game.aggregate<LeaderboardEntry>([
            {
                $facet: {
                    wins: [
                        { $match: { result: "win" } },
                        { $group: { _id: "$winner", wins: { $sum: 1 } } }
                    ],
                    totalGames: [
                        {
                            $project: {
                                players: [
                                    {
                                        playerId: "$player1",
                                        playerName: "$player1Name"
                                    },
                                    {
                                        playerId: "$player2",
                                        playerName: "$player2Name"
                                    }
                                ]
                            }
                        },
                        { $unwind: "$players" },
                        {
                            $group: {
                                _id: "$players.playerId",
                                totalGames: { $sum: 1 },
                                playerName: { $first: "$players.playerName" }
                            }
                        }
                    ]
                }
            },
            {
                $project: {
                    leaderboard: {
                        $map: {
                            input: "$totalGames",
                            as: "player",
                            in: {
                                _id: "$$player._id",
                                playerName: "$$player.playerName",
                                wins: {
                                    $ifNull: [
                                        {
                                            $arrayElemAt: [
                                                "$wins.wins",
                                                { $indexOfArray: ["$wins._id", "$$player._id"] }
                                            ]
                                        },
                                        0
                                    ]
                                },
                                totalGames: "$$player.totalGames",
                                winRate: {
                                    $round: [
                                        {
                                            $multiply: [
                                                {
                                                    $divide: [
                                                        {
                                                            $ifNull: [
                                                                {
                                                                    $arrayElemAt: [
                                                                        "$wins.wins",
                                                                        { $indexOfArray: ["$wins._id", "$$player._id"] }
                                                                    ]
                                                                },
                                                                0
                                                            ]
                                                        },
                                                        "$$player.totalGames"
                                                    ]
                                                },
                                                100
                                            ]
                                        },
                                        2
                                    ]
                                }
                            }
                        }
                    }
                }
            },
            { $unwind: "$leaderboard" },
            { $replaceRoot: { newRoot: "$leaderboard" } },
            { $match: { totalGames: { $gte: 1 } } },
            { $sort: { wins: -1, winRate: -1, totalGames: -1 } },
            { $limit: 20 }
        ]);

        return NextResponse.json(
            {
                success: true,
                data: leaderboard,
                updatedAt: new Date().toISOString()
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Leaderboard fetch error:", error);

        return NextResponse.json(
            {
                success: false,
                error: "Failed to fetch leaderboard",
                message: error instanceof Error ? error.message : "Unknown error occurred"
            },
            { status: 500 }
        );
    }
}