// Word.tsx
import React, { useState } from 'react';
import './Word.css';

interface WordType {
  word: string;
  start: number;
  end: number;
  score: number;
  speaker: string;
  isActive: boolean; // New property
}

interface WordProps {
  word: WordType;
  onClick: () => void;
  isClicked: boolean;
  onWordChange: (newWord: string) => void;
}

const Word: React.FC<WordProps> = ({ word, onClick, isClicked, onWordChange }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedWord, setEditedWord] = useState(word.word);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedWord(event.target.value);
  };

  const handleBlur = () => {
    onWordChange(editedWord);
    setIsEditing(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleBlur();
    }
  };

  return isEditing ? (
    <input 
      type="text" 
      value={editedWord} 
      onChange={handleChange} 
      onBlur={handleBlur} 
      onKeyDown={handleKeyDown}
      autoFocus 
    />
  ) : (
    <span
      className={`word ${isHovered ? 'highlight' : ''} ${isClicked ? 'clicked' : ''} ${!word.isActive ? 'inactive' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      onDoubleClick={handleDoubleClick}
    >
      {word.word + ' '}
    </span>
  );
};

export default Word;
