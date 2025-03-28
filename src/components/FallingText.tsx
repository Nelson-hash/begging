import React from 'react';
import { motion } from 'framer-motion';
import DustParticle from './DustParticle';
import AnimatedGradientText from './AnimatedGradientText';

interface FallingTextProps {
  text: string;
  delay: number;
  fromTop?: boolean;
  className?: string;
}

const FallingText: React.FC<FallingTextProps> = ({ text, delay, fromTop = false, className = "" }) => {
  return (
    <div className="relative inline-block">
      <motion.div
        className={`inline-block font-black mx-1 sm:mx-2 ${className}`}
        initial={{ 
          y: fromTop ? -1000 : 1000,
          opacity: 0,
        }}
        animate={{ 
          y: 0,
          opacity: 1,
        }}
        transition={{
          type: "spring",
          stiffness: 200, // Increased stiffness for faster motion
          damping: 25,    // Adjusted damping for controlled bounce
          delay: delay,
          duration: 0.5   // Added duration limit
        }}
      >
        <AnimatedGradientText text={text} />
      </motion.div>
      <div className="absolute left-1/2 bottom-0 -translate-x-1/2">
        {[...Array(8)].map((_, i) => (
          <DustParticle key={i} delay={delay + 0.3} />
        ))}
      </div>
    </div>
  );
};

export default FallingText;