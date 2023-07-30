/* Transcript.tsx */
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

interface TranscriptProps {
  currentTime: number;
  onWordClick: (time: number) => void;
  playing: boolean;
}

const Transcript: React.FC<TranscriptProps> = ({ currentTime, onWordClick, playing }) => {
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

  useEffect(() => {
    if (playing) {
      setClickedWordIndex(null);
    }
  }, [playing]);

  const handleClick = (index: number) => {
    setClickedWordIndex(index);
    onWordClick(words[index].start);
  };

  const currentWordIndex = words.findIndex(
    word => word.start <= currentTime && word.end >= currentTime
  );

  return (
    <div className="transcript">
      {words.map((word, i) => (
        <Word key={i} word={word} onClick={() => handleClick(i)} isClicked={i === clickedWordIndex || i === currentWordIndex} />
      ))}
    </div>
  );
};

export default Transcript;
