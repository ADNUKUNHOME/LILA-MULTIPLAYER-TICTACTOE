export function generateRoomCode() {
    return Math.random().toString(36).substring(2, 7).toUpperCase();
}

export function validatePlayerData(playerId, playerName) {
    return playerId && playerName && playerName.trim().length > 0;
}