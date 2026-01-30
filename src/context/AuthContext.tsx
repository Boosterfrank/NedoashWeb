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
