// TranscriptEntry.tsx
import React from 'react';
import Word from './Word';

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

interface TranscriptEntryProps {
    entry: Entry;
}

const TranscriptEntry: React.FC<TranscriptEntryProps> = ({ entry }) => {
  console.log('Rendering words for entry:', entry.text);  // New console.log statement
    return (
    <div className="transcript-entry">
        {entry.words.map((word, i) => (
        <Word key={i} word={word} />
        ))}
    </div>
    );
}

export default TranscriptEntry;
