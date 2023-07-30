// Transcript.tsx
import React, { useState, useEffect } from 'react';
import Word from './Word';
import './Transcript.css';

interface WordType {
  word: string;
  start: number;
  end: number;
  score: number;
  speaker: string;
}

interface Entry {
  start: number;
  end: number;
  text: string;
  words: WordType[];
  speaker: string;
}

const Transcript: React.FC = () => {
  const [words, setWords] = useState<WordType[]>([]);
  const [clickedWordIndex, setClickedWordIndex] = useState<number | null>(null);

  useEffect(() => {
    fetch('/MW Hormozi.json')
      .then((res) => res.json())
      .then((data: Entry[]) => {
        const words = data.flatMap(entry => entry.words);
        setWords(words);
      })
      .catch((err) => console.error("Error loading JSON file:", err));
  }, []);

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
