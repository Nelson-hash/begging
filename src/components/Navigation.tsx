import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHotPage = location.pathname === '/hot';

  return (
    <div className="fixed top-0 left-0 right-0 flex justify-between items-center p-4 z-50">
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate('/')}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <Home className="w-6 h-6 text-gray-700" />
      </motion.button>
      
      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate('/hot')}
        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
          isHotPage 
            ? 'bg-gradient-to-r from-orange-400 to-pink-400 text-white'
            : 'hover:bg-gray-100 text-gray-700'
        }`}
      >
        <Flame className={`w-5 h-5 ${isHotPage ? 'animate-pulse' : ''}`} />
        <span className="font-bold hidden sm:block" style={{ fontFamily: 'Space Grotesk' }}>
          Hottest Beggars
        </span>
      </motion.button>
    </div>
  );
};

export default Navigation;