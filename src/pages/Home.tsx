import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Award, Search } from 'lucide-react';

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-6xl md:text-8xl font-black italic tracking-tighter mb-6 relative"
            >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-neon-blue via-white to-neon-pink">
                    NEODASH
                </span>
                <span className="absolute -inset-1 blur-2xl bg-gradient-to-r from-neon-blue/20 to-neon-pink/20 -z-10"></span>
            </motion.h1>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-xl text-gray-400 max-w-2xl mb-12"
            >
                The unofficial browser for community levels and global leaderboards.
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
                <Link to="/levels" className="group">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-neon-surface border border-neon-blue/20 p-8 rounded-2xl h-full flex flex-col items-center justify-center gap-4 hover:border-neon-blue transition-colors shadow-lg shadow-black/50 group-hover:shadow-[0_0_20px_rgba(0,243,255,0.15)]"
                    >
                        <div className="bg-neon-blue/10 p-4 rounded-full text-neon-blue group-hover:bg-neon-blue group-hover:text-black transition-colors">
                            <Search size={32} />
                        </div>
                        <h2 className="text-2xl font-bold">Browse Levels</h2>
                        <p className="text-gray-500 text-sm">Discover new community created tracks.</p>
                    </motion.div>
                </Link>

                <Link to="/hall-of-fame" className="group">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-neon-surface border border-neon-pink/20 p-8 rounded-2xl h-full flex flex-col items-center justify-center gap-4 hover:border-neon-pink transition-colors shadow-lg shadow-black/50 group-hover:shadow-[0_0_20px_rgba(255,0,255,0.15)]"
                    >
                        <div className="bg-neon-pink/10 p-4 rounded-full text-neon-pink group-hover:bg-neon-pink group-hover:text-black transition-colors">
                            <Award size={32} />
                        </div>
                        <h2 className="text-2xl font-bold">Hall of Fame</h2>
                        <p className="text-gray-500 text-sm">See the top players in the world.</p>
                    </motion.div>
                </Link>
            </div>
        </div>
    );
};

export default Home;
