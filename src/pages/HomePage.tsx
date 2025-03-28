import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAnimatedSuggestions } from '../hooks/useAnimatedSuggestions';
import TextLine from '../components/TextLine';
import SuggestionText from '../components/SuggestionText';
import FallingText from '../components/FallingText';

const HomePage = () => {
  const navigate = useNavigate();
  const currentSuggestion = useAnimatedSuggestions();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-16 sm:gap-24 px-4 pt-16">
      <div className="text-center flex flex-col gap-8 sm:gap-16">
        <TextLine 
          texts={[
            { text: "GIVE", delay: 0 },
            { text: "ME", delay: 0.5 },
            { text: "MONEY", delay: 1 }
          ]} 
        />
        <div className="flex items-baseline justify-center gap-2 sm:gap-4">
          <FallingText text="FOR" delay={1.5} className="text-4xl sm:text-6xl md:text-8xl" />
          <SuggestionText text={currentSuggestion} />
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <button
          onClick={() => navigate('/register')}
          className="px-8 py-4 bg-gradient-to-r from-violet-500 to-indigo-500 text-white rounded-full text-xl sm:text-2xl font-bold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transform transition-all duration-200"
          style={{ fontFamily: 'Space Grotesk' }}
        >
          START BEGGING
        </button>
        <p className="text-gray-500 text-sm">
          Join thousands of successful beggars
        </p>
      </div>
    </div>
  );
};

export default HomePage;