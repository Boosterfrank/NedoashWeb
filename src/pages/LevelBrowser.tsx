import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { NeodashApi } from '../api/neodash';
import { ChevronLeft, ChevronRight, Download, Star } from 'lucide-react';

const LevelBrowser = () => {
    const { user } = useAuth();
    const [page, setPage] = useState(1);
    const [sortBy, setSortBy] = useState<'recent' | 'ratings' | 'downloads'>('recent');
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');

    const { data: levels, isLoading, error } = useQuery({
        queryKey: ['levels', user?.uniqueId, page, sortBy, search],
        queryFn: () => {
            if (!user) return Promise.reject('User not logged in');
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
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center text-app-muted">
                <p>Authenticating...</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto">

            {/* Search Card */}
            <div className="bg-app-card border border-app-border rounded-lg p-6 mb-8">
                <h2 className="text-xl font-bold mb-4 border-b border-app-border pb-2">3. Level Search</h2>

                <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                        <label className="block text-sm text-app-muted mb-2">Sort By</label>
                        <select
                            value={sortBy}
                            onChange={(e) => {
                                setSortBy(e.target.value as 'recent' | 'ratings' | 'downloads');
                                setPage(1);
                            }}
                            className="w-full bg-app-bg border border-app-border rounded px-3 py-2 text-white focus:outline-none focus:border-app-blue transition-colors"
                        >
                            <option value="recent">Recent</option>
                            <option value="ratings">Top Rated</option>
                            <option value="downloads">Downloads</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm text-app-muted mb-2">Page</label>
                        <input
                            type="number"
                            min="1"
                            value={page}
                            onChange={(e) => setPage(parseInt(e.target.value) || 1)}
                            className="w-full bg-app-bg border border-app-border rounded px-3 py-2 text-white focus:outline-none focus:border-app-blue transition-colors"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm text-app-muted mb-2">Search Filter (Optional)</label>
                        <input
                            type="text"
                            placeholder="Level Name..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="w-full bg-app-bg border border-app-border rounded px-3 py-2 text-white focus:outline-none focus:border-app-blue transition-colors"
                        />
                    </div>
                </form>

                <button
                    onClick={handleSearch}
                    className="w-full bg-app-blue hover:bg-app-blueHover text-white font-bold py-2 rounded transition-colors"
                >
                    Search Levels
                </button>
            </div>

            {/* Results */}
            {isLoading && (
                <div className="flex justify-center p-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-app-blue"></div>
                </div>
            )}

            {error && (
                <div className="text-center text-red-400 p-8">
                    Error loading levels. Please try again.
                </div>
            )}

            {levels && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {levels.map((level) => (
                        <div
                            key={level.levelId}
                            className="bg-app-card border border-app-border rounded p-4 hover:border-app-blue/50 transition-colors"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold truncate pr-2 text-white" title={tryDecode(level.levelId)}>
                                    {tryDecode(level.levelId) || 'Unknown Level'}
                                </h3>
                                {level.levelDifficulty && (
                                    <span className="text-xs font-mono bg-white/10 px-1.5 py-0.5 rounded text-app-muted">
                                        {level.levelDifficulty}
                                    </span>
                                )}
                            </div>

                            <div className="text-sm text-app-muted mb-4 truncate">
                                by {tryDecode(level.levelAuthor)}
                            </div>

                            <div className="flex items-center justify-between text-sm text-gray-400">
                                <div className="flex items-center gap-1">
                                    <Star size={14} className={level.levelRating > -1 ? "text-yellow-500" : "text-gray-600"} />
                                    <span>{level.levelRating > -1 ? level.levelRating.toFixed(1) : '-'}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Download size={14} />
                                    <span>{level.levelDownloads}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Footer Pagination simple */}
            <div className="flex justify-center items-center gap-6 mt-8">
                <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 rounded hover:bg-white/10 disabled:opacity-50 transition-colors"
                >
                    <ChevronLeft />
                </button>
                <span className="font-mono text-app-blue">PAGE {page}</span>
                <button
                    onClick={() => setPage(p => p + 1)}
                    className="p-2 rounded hover:bg-white/10 transition-colors"
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
