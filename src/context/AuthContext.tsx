import React, { createContext, useContext, useState, useEffect } from 'react';
import { NeodashApi } from '../api/neodash';
import type { AuthResponse } from '../types/neodash';

interface AuthContextType {
    user: AuthResponse | null;
    login: (steamId: string, displayName: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
    error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AuthResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Check localStorage for persisted session
        const storedUser = localStorage.getItem('neodash_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            // Auto-login with provided credentials
            const autoLogin = async () => {
                try {
                    setIsLoading(true);
                    // Hardcoded credentials provided by user
                    // Steam ID: YWxAB3ZedGgGb3sEYXVlB2k
                    // Display Name: Qm9vc3RlcmZyYW5r
                    // Note: The API expects these to be passed to authenticate, which expects RAW strings usually, 
                    // but the user GAVE Base64. 
                    // My previous implementation of `authenticate` takes raw strings and encodes them.
                    // IF the user provided Base64 representing the specific ID, I should decode them first if my API wrapper encodes them again.
                    // OR I should modify the API wrapper to accept pre-encoded strings?
                    // Let's assume the user GAVE me the raw values derived from Base64 or these ARE the Base64 values I should send?
                    // "Steam ID (Base64) YWxAB3ZedGgGb3sEYXVlB2k"
                    // "Display Name (Base64) Qm9vc3RlcmZyYW5r"
                    // My convertB64 helper does `btoa`. If I pass these strings to my `authenticate` function which does `btoa`, they will be double encoded.
                    // I should verify if `authenticate` expects RAW or B64.
                    // My `neodash.ts` says: `steamId: encodeB64(steamId)`.
                    // So if I pass the B64 string, it becomes B64(B64). This is likely wrong.
                    // I should decode the provided string first, OR modify my API to not encode if already encoded.
                    // Let's decode the user provided B64 string *before* passing to `login`.
                    // Wait, are these Base64 strings representing a name? "Qm9vc3RlcmZyYW5r" -> "Boosterfrank".
                    // So I should pass "Boosterfrank" to my `login` function, which will then Encode it.
                    // Yes.

                    const rawSteamId = atob("YWxAB3ZedGgGb3sEYXVlB2k");
                    const rawDisplayName = atob("Qm9vc3RlcmZyYW5r");

                    await login(rawSteamId, rawDisplayName);
                } catch (e) {
                    console.error("Auto-login failed", e);
                } finally {
                    setIsLoading(false); // Ensure loading state is reset even on auto-login failure
                }
            };
            autoLogin();
        }
    }, []);

    const login = async (steamId: string, displayName: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await NeodashApi.authenticate(steamId, displayName);
            if (data.uniqueId && data.token) {
                setUser(data);
                localStorage.setItem('neodash_user', JSON.stringify(data));
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Authentication failed');
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('neodash_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading, error }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
