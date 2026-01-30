export interface AuthResponse {
    uniqueId: number;
    token: string;
}

export interface HallOfFameEntry {
    name: string; // Decoded from Base64
    score: number;
}

export interface Level {
    levelId: string; // Base64
    levelAuthor: string; // Base64
    levelRating: number;
    levelDifficulty: string | null;
    levelDownloads: number;
    levelThumbnail?: string; // Hex string if requested
    levelTopTimes?: string; // Raw string for now
}

export interface LevelDetails extends Level {
    // Add more fields if available in detail view
}

export interface MapTime {
    finishTime: string;
    mapId: string;
    playerId: string;
    playerPos?: number;
}
