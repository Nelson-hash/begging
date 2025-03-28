import React from 'react';
import { motion } from 'framer-motion';

interface DustParticleProps {
  delay: number;
}

const DustParticle: React.FC<DustParticleProps> = ({ delay }) => {
  const randomX = Math.random() * 100 - 50; // -50 to 50
  const randomScale = Math.random() * 0.5 + 0.5; // 0.5 to 1

  return (
    <motion.div
      className="absolute w-2 h-2 bg-gray-200 rounded-full"
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0, randomScale, 0],
        x: [0, randomX],
        y: [0, 30],
      }}
      transition={{
        duration: 0.5,
        delay: delay,
        ease: "easeOut",
      }}
    />
  );
};

export default DustParticle;