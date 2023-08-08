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
  isActive: boolean; // New property
}

interface Entry {
  start: number;
  end: number;
  text: string;
  words: WordType[];
  speaker: string;
}

interface Subtitle {
  start: number;
  end: number;
  text: string;
}

interface TranscriptProps {
  currentTime: number;
  onWordClick: (time: number) => void;
  playing: boolean;
  setSubtitles: (subtitles: Subtitle[]) => void;
  onActiveWordsChange: (start: number, end: number) => void;  // Add this line
}

const computeSubtitles = (words: WordType[]): Subtitle[] => {
  const groups: WordType[][] = [];
  let group: WordType[] = [];
  words.forEach(word => {
    group.push(word);
    if (word.word.endsWith('.') || word.word.endsWith('?') || word.word.endsWith(',')) {
      groups.push(group);
      group = [];
    }
  });
  if (group.length > 0) {
    groups.push(group);
  }

  const subtitles: Subtitle[] = [];
  groups.forEach(group => {
    const minWords = 2;
    const maxWords = 4;
    const avgWords = Math.round((minWords + maxWords) / 2);
    let i = 0;
    while (i < group.length) {
      let subtitleWords = group.slice(i, i + avgWords);
      const subtitle = {
        start: subtitleWords[0].start,
        end: subtitleWords[subtitleWords.length - 1].end,
        text: subtitleWords.map(word => word.word).join(' ')
      };
      subtitles.push(subtitle);
      i += avgWords;
    }
  });

  return subtitles;
};

const Transcript: React.FC<TranscriptProps> = ({ currentTime, onWordClick, playing, setSubtitles, onActiveWordsChange }) => {
  const [words, setWords] = useState<WordType[]>([]);
  const [clickedWordIndex, setClickedWordIndex] = useState<number | null>(null);

  useEffect(() => {
    fetch('/MW Hormozi.json')
      .then((res) => res.json())
      .then((data: Entry[]) => {
        const specifiedStartTime = 20; // Example start time, adjust dynamically
        const specifiedEndTime = 40;  // Example end time, adjust dynamically
  
        const activeWords = data.flatMap(entry => entry.words.map(word => ({
          ...word,
          isActive: word.start >= specifiedStartTime && word.end <= specifiedEndTime
        })));
        setWords(activeWords);
        setSubtitles(computeSubtitles(activeWords));

        // Control video playback based on active words
        const firstActiveWord = activeWords.find(word => word.isActive);
        const lastActiveWord = [...activeWords].reverse().find(word => word.isActive);
        
        if (firstActiveWord && lastActiveWord) {
          onActiveWordsChange(firstActiveWord.start, lastActiveWord.end);  // Call the callback with the determined times
        }
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

  const handleWordChange = (newWord: string, index: number) => {
    const newWords = [...words];
    newWords[index] = { ...newWords[index], word: newWord };
    setWords(newWords);
    setSubtitles(computeSubtitles(newWords));
  };

  const currentWordIndex = words.findIndex(
    word => word.start <= currentTime && word.end >= currentTime
  );

  return (
    <div className="transcript">
      {words.map((word, i) => (
        <Word 
          key={i} 
          word={word} 
          onClick={() => handleClick(i)} 
          isClicked={i === clickedWordIndex || i === currentWordIndex} 
          onWordChange={(newWord) => handleWordChange(newWord, i)}
        />
      ))}
    </div>
  );
};

export default Transcript;