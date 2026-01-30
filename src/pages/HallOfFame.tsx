import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { NeodashApi } from '../api/neodash';

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
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center text-app-muted">
                <p>Authenticating...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-2 text-white">Neodash Hall of Fame</h1>
            <p className="text-center text-sm text-app-muted mb-8 italic">
                Official Hall of Fame. 1st = 4 points, 2nd = 2 points, 3rd = 1 point. Grid levels award double points.
            </p>

            {isLoading && (
                <div className="flex justify-center p-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-app-blue"></div>
                </div>
            )}

            {error && (
                <div className="bg-red-900/20 border border-red-500/50 text-red-200 p-4 rounded-lg text-center">
                    Failed to load leaderboard. Please try again later.
                </div>
            )}

            {players && (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-app-text border-b border-white/10">
                                <th className="py-3 px-4 w-20">Rank</th>
                                <th className="py-3 px-4">Player</th>
                                <th className="py-3 px-4 text-right">Score</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-300">
                            {players.map((player, index) => (
                                <tr
                                    key={`${player.name}-${index}`}
                                    className="hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                                >
                                    <td className="py-3 px-4 font-medium text-white">
                                        {index + 1}<sup className="text-xs">{getOrdinal(index + 1)}</sup>
                                    </td>
                                    <td className="py-3 px-4 font-medium">
                                        {player.name}
                                    </td>
                                    <td className="py-3 px-4 text-right font-mono text-white">
                                        {player.score.toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

const getOrdinal = (n: number) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
};

export default HallOfFame;
