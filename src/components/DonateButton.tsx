// src/components/DonateButton.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface DonateButtonProps {
  onClick?: () => void;
}

const DonateButton: React.FC<DonateButtonProps> = ({ onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ 
        duration: 0.4,
        ease: [0.43, 0.13, 0.23, 0.96]
      }}
      className="px-6 py-2 sm:px-8 sm:py-3 bg-gradient-to-r from-violet-400 to-indigo-400 text-white rounded-full text-lg sm:text-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
      style={{ fontFamily: 'Space Grotesk' }}
    >
      DONATE
    </motion.button>
  );
};

export default DonateButton;
