import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedGradientTextProps {
  text: string;
}

const getAnimationProperties = (text: string) => {
  const baseText = text.split(' ')[0];  // Get text without emoji
  
  switch (baseText) {
    case 'GIVE':
      return {
        duration: 3,
        delay: 0,
        gradient: 'from-rose-400 via-fuchsia-500 to-indigo-500'
      };
    case 'ME':
      return {
        duration: 4,
        delay: 0.5,
        gradient: 'from-violet-600 via-purple-500 to-indigo-500'
      };
    case 'MONEY':
      return {
        duration: 5,
        delay: 1,
        gradient: 'from-blue-500 via-cyan-500 to-teal-500'
      };
    case 'FOR':
      return {
        duration: 3.5,
        delay: 1.5,
        gradient: 'from-emerald-500 via-teal-500 to-cyan-500'
      };
    default:
      // For suggestion words
      return {
        duration: 4,
        delay: 0,
        gradient: 'from-amber-500 via-orange-500 to-yellow-500'
      };
  }
};

const AnimatedGradientText: React.FC<AnimatedGradientTextProps> = ({ text }) => {
  const { duration, delay, gradient } = getAnimationProperties(text);
  const [baseText, emoji] = text.split(' ');

  return (
    <motion.div
      className="inline-flex items-baseline"
    >
      <motion.span
        className={`inline-block bg-gradient-to-r ${gradient} bg-clip-text`}
        style={{
          fontFamily: 'Space Grotesk',
          backgroundSize: '200% auto',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          WebkitTextFillColor: 'transparent'
        }}
        animate={{
          backgroundPosition: ['0% center', '200% center']
        }}
        transition={{
          duration,
          delay,
          ease: "linear",
          repeat: Infinity,
          repeatType: "reverse"
        }}
      >
        {baseText}
      </motion.span>
      {emoji && <span className="ml-2">{emoji}</span>}
    </motion.div>
  );
};

export default AnimatedGradientText;