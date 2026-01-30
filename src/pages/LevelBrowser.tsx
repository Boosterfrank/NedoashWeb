import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { NeodashApi } from '../api/neodash';
import { motion } from 'framer-motion';
import { Search, Star, Download, ChevronLeft, ChevronRight } from 'lucide-react';

const LevelBrowser = () => {
    const { user } = useAuth();
    const [page, setPage] = useState(1);
    const [sortBy, setSortBy] = useState<'recent' | 'ratings' | 'downloads'>('recent');
    // API doesn't seem to support text search in the list request directly based on doc?
    // "searchFilter (string, optional): Search by level name." - Yes it does.
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');

    const { data: levels, isLoading, error } = useQuery({
        queryKey: ['levels', user?.uniqueId, page, sortBy, search],
        queryFn: () => {
            if (!user) return Promise.reject('User not logged in');
            // Note: API definition in neodash.ts might need update to support searchFilter param if I missed it.
            // I checked my neodash.ts implementation, I missed `searchFilter`. I will need to update it.
            // For now I will assume I'll fit it or update the API file.
            // Let's check NeodashApi.searchLevels signature in my code... 
            // It has `uniqueId, token, page, sortBy, withThumbnails`. No `searchFilter`!
            // I need to update neodash.ts first or pass it as 'recent' (sortBy) isn't enough.
            // Wait, the user doc says `searchFilter` is optional.
            return NeodashApi.searchLevels(user.uniqueId, user.token, page, sortBy, false, search);
        },
        enabled: !!user,
        staleTime: 60000,
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearch(searchInput);
        setPage(1);
    };

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                <h2 className="text-3xl font-bold mb-4">Login Required</h2>
                <p className="text-gray-400">Please login to browse levels.</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-4xl font-bold italic">LEVEL BROWSER</h1>

                <div className="flex gap-4 items-center w-full md:w-auto">
                    <form onSubmit={handleSearch} className="relative flex-1 md:w-64">
                        <input
                            type="text"
                            placeholder="Search levels..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="w-full bg-neon-surface border border-neon-blue/20 rounded-full py-2 px-4 pl-10 focus:border-neon-blue outline-none transition-colors"
                        />
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    </form>

                    <select
                        value={sortBy}
                        onChange={(e) => {
                            setSortBy(e.target.value as 'recent' | 'ratings' | 'downloads');
                            setPage(1);
                        }}
                        className="bg-neon-surface border border-neon-blue/20 rounded-full py-2 px-4 focus:border-neon-blue outline-none appearance-none cursor-pointer"
                    >
                        <option value="recent">Recent</option>
                        <option value="ratings">Top Rated</option>
                        <option value="downloads">Downloads</option>
                    </select>
                </div>
            </div>

            {isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-neon-surface/50 h-48 rounded-xl animate-pulse"></div>
                    ))}
                </div>
            )}

            {error && (
                <div className="text-center text-red-400 p-8">
                    Error loading levels. Please try again.
                </div>
            )}

            {levels && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {levels.map((level) => (
                        <motion.div
                            key={level.levelId}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ y: -5 }}
                            className="bg-neon-surface border border-neon-blue/10 rounded-xl overflow-hidden hover:border-neon-blue/50 transition-all shadow-lg hover:shadow-neon-blue/20"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-bold truncate pr-4" title={level.levelId}>
                                        {/* Level name is encoded in levelId if it's name-based or ID? 
                        The doc says "levelId=TWVnYXNwaGVyZQ==" (Megasphere in B64).
                        Usually levelId IS the name in base64.
                    */}
                                        {tryDecode(level.levelId) || 'Unknown Level'}
                                    </h3>
                                    {level.levelDifficulty && (
                                        <span className={`px-2 py-1 rounded text-xs font-bold 
                      ${level.levelDifficulty.includes('S') ? 'bg-neon-pink/20 text-neon-pink' : 'bg-neon-blue/20 text-neon-blue'}`}>
                                            {level.levelDifficulty}
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center text-sm text-gray-400 mb-4">
                                    <span className="mr-2">by</span>
                                    <span className="text-white hover:text-neon-pink cursor-pointer transition-colors">
                                        {tryDecode(level.levelAuthor)}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center pt-4 border-t border-white/5">
                                    <div className="flex items-center gap-4 text-sm">
                                        <div className="flex items-center gap-1 text-yellow-400">
                                            <Star size={16} />
                                            <span>{level.levelRating > -1 ? level.levelRating.toFixed(1) : '-'}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-green-400">
                                            <Download size={16} />
                                            <span>{level.levelDownloads}</span>
                                        </div>
                                    </div>
                                    {/* <button className="text-neon-blue hover:text-white transition-colors text-sm font-bold">
                    DETAILS
                  </button> */}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Pagination Controls */}
            <div className="flex justify-center items-center gap-6 mt-12">
                <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 rounded-full bg-neon-surface border border-neon-blue/20 disabled:opacity-50 hover:border-neon-blue transition-colors"
                >
                    <ChevronLeft />
                </button>
                <span className="font-mono text-neon-blue">PAGE {page}</span>
                <button
                    onClick={() => setPage(p => p + 1)}
                    // Disable next not possible without knowing total pages, but we can guess or just let it spin empty
                    className="p-2 rounded-full bg-neon-surface border border-neon-blue/20 hover:border-neon-blue transition-colors"
                >
                    <ChevronRight />
                </button>
            </div>

        </div>
    );
};

const tryDecode = (str: string) => {
    try {
        return atob(str);
    } catch (e) {
        return str;
    }
};

export default LevelBrowser;
