import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FallingText from './FallingText';

interface SuggestionTextProps {
  text: string | null;
}

const SuggestionText: React.FC<SuggestionTextProps> = ({ text }) => {
  if (!text) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={text}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{
          type: "spring",
          stiffness: 300,  // Increased stiffness
          damping: 25,     // Adjusted damping
          duration: 0.4    // Faster duration
        }}
      >
        <FallingText 
          text={text} 
          delay={0} 
          fromTop={true} 
          className="text-4xl sm:text-6xl md:text-8xl"
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default SuggestionText;