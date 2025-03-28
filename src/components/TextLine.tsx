import React from 'react';
import FallingText from './FallingText';

interface TextLineProps {
  texts: { text: string; delay: number }[];
  className?: string;
}

const TextLine: React.FC<TextLineProps> = ({ texts, className = "" }) => {
  return (
    <div className={`relative flex items-baseline justify-center gap-2 sm:gap-4 ${className}`}>
      {texts.map(({ text, delay }) => (
        <FallingText 
          key={text} 
          text={text} 
          delay={delay} 
          fromBottom={delay > 1}
          className={delay > 1 ? "text-4xl sm:text-6xl md:text-8xl" : "text-4xl sm:text-6xl md:text-8xl"}
        />
      ))}
    </div>
  );
};

export default TextLine;