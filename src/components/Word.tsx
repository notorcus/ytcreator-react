// Word.tsx
import React, { useState } from 'react';
import './Word.css';

interface WordType {
  word: string;
  start: number;
  end: number;
  score: number;
  speaker: string;
}

interface WordProps {
  word: WordType;
  onClick: () => void;
  isClicked: boolean;
}

const Word: React.FC<WordProps> = ({ word, onClick, isClicked }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <span
      className={`word ${isHovered ? 'highlight' : ''} ${isClicked ? 'clicked' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {word.word + ' '}
    </span>
  );
};

export default Word;
