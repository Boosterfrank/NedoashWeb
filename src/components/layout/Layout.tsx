import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { X, User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { user, login, logout, isLoading } = useAuth();
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [steamId, setSteamId] = useState('');
    const [displayName, setDisplayName] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        await login(steamId, displayName);
        setIsLoginOpen(false);
    };

    return (
        <nav className="bg-neon-dark/80 backdrop-blur-md border-b border-neon-blue/20 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-neon-pink">
                            NEODASH
                        </Link>
                        <div className="hidden md:block ml-10">
                            <div className="flex items-baseline space-x-4">
                                <Link to="/" className="text-gray-300 hover:text-neon-blue px-3 py-2 rounded-md transition-colors">
                                    Home
                                </Link>
                                <Link to="/levels" className="text-gray-300 hover:text-neon-pink px-3 py-2 rounded-md transition-colors">
                                    Level Browser
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div>
                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className="text-neon-blue text-sm">ID: {user.uniqueId}</span>
                                <button
                                    onClick={logout}
                                    className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <LogOut size={18} />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsLoginOpen(true)}
                                className="flex items-center gap-2 text-neon-blue border border-neon-blue/50 px-4 py-1.5 rounded-full hover:bg-neon-blue/10 transition-all"
                            >
                                <User size={18} />
                                <span>Login API</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isLoginOpen && !user && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-neon-surface border border-neon-blue/30 p-8 rounded-xl w-full max-w-md shadow-[0_0_30px_rgba(0,243,255,0.2)]"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-white">API Authentication</h2>
                                <button onClick={() => setIsLoginOpen(false)} className="text-gray-400 hover:text-white">
                                    <X />
                                </button>
                            </div>
                            <form onSubmit={handleLogin} className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Steam ID (Base64 or Raw?)</label>
                                    <input
                                        type="text"
                                        value={steamId}
                                        onChange={(e) => setSteamId(e.target.value)}
                                        placeholder="Enter Steam ID"
                                        className="w-full bg-black/30 border border-neon-blue/20 rounded p-2 text-white focus:border-neon-blue outline-none"
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-1">*Use a dummy ID if unsure (e.g. 'TestID')</p>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Display Name</label>
                                    <input
                                        type="text"
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                        placeholder="Enter Username"
                                        className="w-full bg-black/30 border border-neon-blue/20 rounded p-2 text-white focus:border-neon-blue outline-none"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-gradient-to-r from-neon-blue to-neon-pink text-white font-bold py-2 rounded hover:opacity-90 transition-opacity"
                                >
                                    {isLoading ? 'Connecting...' : 'Connect'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="min-h-screen bg-neon-dark text-white font-sans selection:bg-neon-pink selection:text-white">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
                {children}
            </main>
            <footer className="border-t border-neon-blue/10 py-6 text-center text-gray-500 text-sm">
                <p>Neodash Fan Site | Not affiliated with the game developers</p>
            </footer>
        </div>
    );
};
