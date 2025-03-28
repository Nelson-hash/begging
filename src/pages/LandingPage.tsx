import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const LandingPage = () => {
  const [reason, setReason] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reason.trim()) {
      navigate(`/result?reason=${encodeURIComponent(reason)}`);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <motion.form 
        onSubmit={handleSubmit}
        className="w-full max-w-md px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <input
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter your reason here..."
          className="w-full px-4 py-3 text-3xl text-center bg-transparent border-b-2 border-gray-300 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-violet-400 transition-colors"
          style={{ fontFamily: 'Space Grotesk' }}
          autoFocus
        />
        <motion.p 
          className="mt-4 text-center text-gray-400 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Press Enter to continue
        </motion.p>
      </motion.form>
    </div>
  );
};

export default LandingPage;