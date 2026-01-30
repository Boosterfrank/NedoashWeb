import type { AuthResponse, HallOfFameEntry, Level } from '../types/neodash';

const BASE_URL = 'https://neodashbrowse.francobetancourt.workers.dev';

// Helper to decode Base64 safely
const decodeB64 = (str: string) => {
    try {
        return atob(str);
    } catch (e) {
        return str;
    }
};

// Helper to encode Base64
const encodeB64 = (str: string) => btoa(str);

// Helper to parse key-value text response (key=value&key2=value2...)
const parseKVResponse = (text: string): Record<string, string> => {
    const result: Record<string, string> = {};
    const pairs = text.split('&');
    pairs.forEach(pair => {
        const [key, value] = pair.split('=');
        if (key) result[key] = value;
    });
    return result;
};

// Helper to parse Hall of Fame response
// Format: NameBase64,Score/NameBase64,Score...
const parseHallOfFame = (text: string): HallOfFameEntry[] => {
    if (!text) return [];
    // Split by slash first? Or matches?
    // Example: Q0pFWg==,578/R2FtYTMw,299
    // It seems entries are separated by '/'
    return text.split('/').map(entry => {
        const [nameB64, score] = entry.split(',');
        return {
            name: decodeB64(nameB64),
            score: parseInt(score, 10)
        };
    }).filter(e => !isNaN(e.score));
};

// Helper to parse Level List
// The example response shows levels concatenated: levelId=...&... \levelId=...
// It seems they are separated by backslash '\' or just concatenated?
// "levelId=...&... \levelId=..."  Suggests a delimiter. The doc says "\levelId=..."
const parseLevelList = (text: string): Level[] => {
    if (!text) return [];
    // Split by the delimiter which seems to be start of next level or end of previous?
    // Docs example: ...&levelTopTimes={...}\levelId=...
    // So likely separated by '\'
    const levelStrings = text.split('\\');
    return levelStrings.map(levelStr => {
        const data = parseKVResponse(levelStr);
        return {
            levelId: data.levelId,
            levelAuthor: data.levelAuthor,
            levelRating: parseFloat(data.levelRating),
            levelDifficulty: data.levelDifficulty === 'null' ? null : data.levelDifficulty,
            levelDownloads: parseInt(data.levelDownloads, 10),
            levelThumbnail: data.levelThumbnail,
            levelTopTimes: data.levelTopTimes
        };
    }).filter(l => l.levelId); // filter empty
};

export const NeodashApi = {
    authenticate: async (steamId: string, displayName: string, ver: string = '102a'): Promise<AuthResponse> => {
        const body = new URLSearchParams({
            steamId: encodeB64(steamId),
            displayName: encodeB64(displayName),
            ver
        });

        const res = await fetch(`${BASE_URL}/authenticate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body
        });

        const text = await res.text();
        const data = parseKVResponse(text);
        return {
            uniqueId: parseInt(data.uniqueId, 10),
            token: data.token
        };
    },

    getHallOfFame: async (uniqueId: number, token: string): Promise<HallOfFameEntry[]> => {
        const body = new URLSearchParams({
            uniqueId: uniqueId.toString(),
            token
        });

        const res = await fetch(`${BASE_URL}/getHallOfFame`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body
        });

        const text = await res.text();
        return parseHallOfFame(text);
    },

    searchLevels: async (
        uniqueId: number,
        token: string,
        page: number = 1,
        sortBy: 'ratings' | 'recent' | 'downloads' = 'recent',
        withThumbnails: boolean = false,
        searchFilter?: string
    ): Promise<Level[]> => {
        const body = new URLSearchParams({
            uniqueId: uniqueId.toString(),
            token,
            page: page.toString(),
            sortBy,
            withThumbnails: withThumbnails ? 'TRUE' : 'FALSE'
        });

        if (searchFilter) {
            body.append('searchFilter', searchFilter);
        }

        const res = await fetch(`${BASE_URL}/requestLevelList`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body
        });

        const text = await res.text();
        return parseLevelList(text);
    }
};
