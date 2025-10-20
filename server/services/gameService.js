import axios from "axios";

export class GameService {
    static async saveGameResult(gameData) {
        try {
            const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/games`;

            const response = await axios.post(apiUrl, gameData, {
                headers: { "Content-Type": "application/json" },
            });

            if (response.data.success) {
                console.log("Game saved via Vercel API:", response.data.data._id);
                return { success: true };
            } else {
                console.error("Failed to save game:", response.data.error);
                return { success: false, error: response.data.error };
            }
        } catch (error) {
            console.error("Error saving game result:", error.message);
            return { success: false, error: error.message };
        }
    }
}
