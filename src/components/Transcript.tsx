// Transcript.tsx
import React, { useState, useEffect } from 'react';
import Word from './Word';
import './Transcript.css';

const Transcript: React.FC = () => {
  const [text, setText] = useState('');
  const [clickedWordIndex, setClickedWordIndex] = useState<number | null>(null);

  useEffect(() => {
    fetch('/transcript.txt')
      .then((res) => res.text())
      .then((data) => {
        setText(data);
      })
      .catch((err) => console.error("Error loading text file:", err));
  }, []);

  const words = text.split(/\s+/).map((word, i) => {
    return { word, start: i, end: i + 1, score: 1, speaker: 'Speaker 1' };
  });

  const handleClick = (index: number) => {
    setClickedWordIndex(index);
  };

  return (
    <div className="transcript">
      {words.map((word, i) => (
        <Word key={i} word={word} onClick={() => handleClick(i)} isClicked={i === clickedWordIndex} />
      ))}
    </div>
  );
};

export default Transcript;
