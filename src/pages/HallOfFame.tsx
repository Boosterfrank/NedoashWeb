import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { NeodashApi } from '../api/neodash';
import { motion } from 'framer-motion';
import { Trophy, User } from 'lucide-react';

const HallOfFame = () => {
    const { user } = useAuth();

    const { data: players, isLoading, error } = useQuery({
        queryKey: ['hallOfFame', user?.uniqueId],
        queryFn: () => {
            if (!user) return Promise.reject('User not logged in');
            return NeodashApi.getHallOfFame(user.uniqueId, user.token);
        },
        enabled: !!user,
    });

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                <Trophy size={64} className="text-gray-600 mb-4" />
                <h2 className="text-3xl font-bold mb-4">Hall of Fame</h2>
                <p className="text-gray-400">Login required to view the global leaderboard.</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Trophy className="text-neon-pink" size={40} />
                <h1 className="text-4xl font-bold italic">HALL OF FAME</h1>
            </div>

            {isLoading && (
                <div className="flex justify-center p-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-pink"></div>
                </div>
            )}

            {error && (
                <div className="bg-red-900/20 border border-red-500/50 text-red-200 p-4 rounded-lg">
                    Failed to load leaderboard. Please try again later.
                </div>
            )}

            {players && (
                <div className="space-y-4">
                    {players.map((player, index) => (
                        <motion.div
                            key={`${player.name}-${index}`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`bg-neon-surface p-4 rounded-lg flex items-center justify-between border ${index < 3 ? 'border-neon-pink/50' : 'border-neon-blue/10'} hover:border-neon-blue/50 transition-colors`}
                        >
                            <div className="flex items-center gap-4">
                                <span className={`text-2xl font-bold w-12 text-center ${index < 3 ? 'text-neon-pink' : 'text-gray-500'}`}>
                                    #{index + 1}
                                </span>
                                <div className="flex items-center gap-2">
                                    <User size={18} className="text-gray-400" />
                                    <span className="font-semibold text-lg">{player.name}</span>
                                </div>
                            </div>
                            <div className="font-mono text-neon-blue font-bold text-xl">
                                {player.score.toLocaleString()}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HallOfFame;
