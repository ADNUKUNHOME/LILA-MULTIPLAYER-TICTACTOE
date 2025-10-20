import mongoose, { Document, Schema, Model } from "mongoose";

export interface IGame extends Document {
    player1: string;
    player2: string;
    winner: string | null;
    result: "win" | "loss" | "draw";
    type: "quick" | "private";
    date: Date;
    player1Name?: string;
    player2Name?: string;
    winningSymbol?: "X" | "O";
    duration?: number;
}

const GameSchema: Schema = new Schema({
    player1: { type: String, required: true },
    player2: { type: String, required: true },
    winner: { type: String, default: null },
    result: { type: String, enum: ["win", "loss", "draw"], required: true },
    type: { type: String, enum: ["quick", "private"], required: true },
    date: { type: Date, default: Date.now },
    player1Name: String,
    player2Name: String,
    winningSymbol: { type: String, enum: ["X", "O"] },
    duration: Number
}, {
    timestamps: true
});

GameSchema.index({ date: -1 });
GameSchema.index({ winner: 1 });
GameSchema.index({ type: 1 });

export const Game: Model<IGame> = mongoose.models.Game || mongoose.model<IGame>("Game", GameSchema);