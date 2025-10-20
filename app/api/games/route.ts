import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { GameData } from "@/types/game";
import { Game } from "@/models/game";
import mongoose from "mongoose";


export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        await dbConnect();

        const body = await req.json();

        console.log('Received game data:', body);

        // Required fields check
        const requiredFields = ["player1", "player2", "type"];
        for (const field of requiredFields) {
            if (!body[field]) {
                return NextResponse.json(
                    { success: false, error: `Missing required field: ${field}` },
                    { status: 400 }
                );
            }
        }

        // Validate game type
        if (!["quick", "private"].includes(body.type)) {
            return NextResponse.json(
                { success: false, error: "Invalid game type" },
                { status: 400 }
            );
        }

        // Calculate result if not provided
        let result = body.result;
        if (!result && body.winner) {
            // Determine result based on winner
            result = body.winner === body.player1 ? 'win' : 'loss';
        } else if (!result) {
            result = 'draw';
        }

        // Validate result
        if (!["win", "loss", "draw"].includes(result)) {
            return NextResponse.json(
                { success: false, error: "Invalid result value" },
                { status: 400 }
            );
        }

        const gameData = {
            player1: body.player1,
            player2: body.player2,
            player1Name: body.player1Name || `Player ${body.player1.substring(0, 8)}`,
            player2Name: body.player2Name || `Player ${body.player2.substring(0, 8)}`,
            winner: body.winner || null,
            result: result,
            type: body.type,
            winningSymbol: body.winningSymbol || null,
            duration: body.duration || 0,
            date: body.date || new Date()
        };

        console.log('Creating game with data:', gameData);

        const game = await Game.create(gameData);

        return NextResponse.json(
            { success: true, data: game },
            { status: 201 }
        );
    } catch (error) {
        console.error("Game creation error:", error);

        if (error instanceof mongoose.Error.ValidationError) {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return NextResponse.json(
                {
                    success: false,
                    error: "Validation failed",
                    details: validationErrors
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            {
                success: false,
                error: "Internal server error",
                message: error instanceof Error ? error.message : "Unknown error occurred"
            },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get("limit") || "50");
        const skip = parseInt(searchParams.get("skip") || "0");
        const playerId = searchParams.get("playerId");

        let query = {};
        if (playerId) {
            query = {
                $or: [
                    { player1: playerId },
                    { player2: playerId }
                ]
            };
        }

        const games = await Game.find(query)
            .sort({ date: -1 })
            .limit(Math.min(limit, 100))
            .skip(skip)
            .lean();

        return NextResponse.json(
            { success: true, data: games, count: games.length },
            { status: 200 }
        );
    } catch (error) {
        console.error("Games fetch error:", error);

        return NextResponse.json(
            {
                success: false,
                error: "Failed to fetch games",
                message: error instanceof Error ? error.message : "Unknown error occurred"
            },
            { status: 500 }
        );
    }
}