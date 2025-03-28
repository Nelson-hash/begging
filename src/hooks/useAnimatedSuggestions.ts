import { useState, useEffect, useCallback } from 'react';

const suggestions = [
  "SCHOOL 📚",
  "ALCOHOL 🍺",
  "PIZZA 🍕",
  "COFFEE ☕",
  "BITCOIN 💰",
  "NETFLIX 🎬",
] as const;

export const useAnimatedSuggestions = () => {
  const [currentIndex, setCurrentIndex] = useState(-1);

  const nextSuggestion = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % suggestions.length);
  }, []);

  useEffect(() => {
    // Initial delay to show first suggestion
    const initialTimer = setTimeout(() => {
      nextSuggestion();
    }, 2000);

    // Regular interval for subsequent suggestions
    const interval = setInterval(nextSuggestion, 3000); // Reduced interval for faster cycling

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [nextSuggestion]);

  return currentIndex === -1 ? null : suggestions[currentIndex];
};