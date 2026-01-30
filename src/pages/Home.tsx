import { Link } from 'react-router-dom';
import { Trophy, Search } from 'lucide-react';

const Home = () => {
    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-12">NeoDash Community Browser</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link to="/hall-of-fame" className="block group">
                    <div className="bg-app-card border border-app-border rounded-lg p-6 hover:border-app-blue transition-colors h-full">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Trophy className="text-app-blue" size={24} />
                            Hall of Fame
                        </h2>
                        <p className="text-app-muted text-sm mb-6">
                            View the global leaderboard of top players.
                        </p>
                        <button className="w-full bg-app-blue hover:bg-app-blueHover text-white font-semibold py-2 rounded text-sm transition-colors">
                            Get Hall of Fame
                        </button>
                    </div>
                </Link>

                <Link to="/levels" className="block group">
                    <div className="bg-app-card border border-app-border rounded-lg p-6 hover:border-app-blue transition-colors h-full">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Search className="text-app-blue" size={24} />
                            Level Search
                        </h2>
                        <p className="text-app-muted text-sm mb-6">
                            Browse and search through user-created levels.
                        </p>
                        <button className="w-full bg-app-blue hover:bg-app-blueHover text-white font-semibold py-2 rounded text-sm transition-colors">
                            Search Levels
                        </button>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default Home;
