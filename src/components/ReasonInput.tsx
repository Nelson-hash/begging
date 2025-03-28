import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const ReasonInput: React.FC = () => {
  const [reason, setReason] = useState('');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.5 }}
      className="mt-20 w-full max-w-md"
    >
      <input
        type="text"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Enter your reason here..."
        className="w-full px-4 py-2 text-2xl text-center bg-transparent border-b-2 border-gray-300 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-violet-400 transition-colors"
        style={{ fontFamily: 'Space Grotesk' }}
      />
    </motion.div>
  );
}