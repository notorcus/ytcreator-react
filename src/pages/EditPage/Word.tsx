import React, { useState } from 'react';
import './Word.css';

interface WordType {
  word: string;
  start: number;
  end: number;
  score: number;
  speaker: string;
  isActive: boolean;
}

interface WordProps {
  word: WordType;
  onClick: () => void;
  onWordChange: (newWord: string) => void;
  index: number;
  selectedWordIndices: { start: number, end: number } | null;
}

const Word: React.FC<WordProps> = ({ word, onClick, onWordChange, index, selectedWordIndices }) => {
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

  const isSingleClicked = selectedWordIndices && index === selectedWordIndices.start && index === selectedWordIndices.end;
  const isPartOfSelection = selectedWordIndices && index >= selectedWordIndices.start && index <= selectedWordIndices.end;

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
        className={`word ${isHovered ? 'highlight' : ''} ${isSingleClicked ? 'clicked' : ''} ${!word.isActive ? 'inactive' : ''} ${isPartOfSelection ? 'multiple-select' : ''}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        onDoubleClick={handleDoubleClick}
        data-index={index}
    >
        {word.word + ' '}
    </span>
  );
};

export default Word;
